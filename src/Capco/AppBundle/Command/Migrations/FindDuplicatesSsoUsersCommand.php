<?php

namespace Capco\AppBundle\Command\Migrations;

use Capco\AppBundle\GraphQL\Mutation\DeleteAccountMutation;
use Capco\AppBundle\GraphQL\Resolver\User\UserContributionsCountResolver;
use Capco\UserBundle\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\HelperInterface;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ConfirmationQuestion;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;

class FindDuplicatesSsoUsersCommand extends Command
{
    private DeleteAccountMutation $deleteAccountMutation;
    private UserRepository $userRepository;
    private UserContributionsCountResolver $countResolver;
    private EntityManagerInterface $em;

    public function __construct(
        string $name,
        UserRepository $userRepository,
        UserContributionsCountResolver $countResolver,
        DeleteAccountMutation $deleteAccountMutation,
        EntityManagerInterface $em
    ) {
        parent::__construct($name);
        $this->deleteAccountMutation = $deleteAccountMutation;
        $this->userRepository = $userRepository;
        $this->countResolver = $countResolver;
        $this->em = $em;
    }

    public function findSameUsers(string $sso, string $ssoId, SymfonyStyle $io): array
    {
        switch ($sso) {
            case 'france_connect':
                $users = $this->userRepository->findSameFranceConnectId($ssoId);

                break;
            case 'facebook':
                $users = $this->userRepository->findSameFacebookId($ssoId);

                break;
            case 'twitter':
                $users = $this->userRepository->findSameTwitterId($ssoId);

                break;
            case 'openId':
                $users = $this->userRepository->findSameOpenId($ssoId);

                break;
            default:
                $users = $this->userRepository->findSameFranceConnectId($ssoId);
        }

        return $users;
    }

    protected function configure()
    {
        parent::configure(); // TODO: Change the autogenerated stub
        $this->setDescription('Interface to find duplicates User');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $helper = $this->getHelper('question');
        $io = new SymfonyStyle($input, $output);
        $input->setInteractive(true);
        $sso = 'all';

        $res = $this->findDuplicatesUsers($sso, $input, $output, $io);
        if (!$res) {
            return 0;
        }
        $duplicatesUsers = $res['duplicatesUsers'];
        $ssoId = $res['ssoId'];
        $default = $duplicatesUsers[0][$ssoId];

        $question = new Question(
            "Please enter the ${ssoId} from the table ⬆, default : ${default} (row 1)" . \PHP_EOL,
            "${default}"
        );

        $ssoId = $helper->ask($input, $output, $question);
        $key = array_search($ssoId, array_column($duplicatesUsers, 'all_id'));
        $sso = $duplicatesUsers[$key]['SSO'];

        $users = $this->findSameUsers($sso, $ssoId, $io);
        $usersWithContributions = $this->countUserContributions($users, $io);
        $this->deleteDuplicateUser($usersWithContributions, $input, $output, $helper, $io);

        $this->execute($input, $output);

        return 0;
    }

    private function deleteDuplicateUser(
        array $usersWithContributions,
        InputInterface $input,
        OutputInterface $output,
        HelperInterface $helper,
        SymfonyStyle $io
    ) {
        $userToDelete = null;
        $row = 0;
        foreach ($usersWithContributions as $key => $user) {
            if (0 === $user['totalContributions']) {
                $userToDelete = $user;
                $row = $key + 1;

                break;
            }
        }
        $question = new Question(
            sprintf(
                'Please enter the userId to delete, default : %s (column %d)' . \PHP_EOL,
                $userToDelete['userId'],
                $row
            ),
            $userToDelete['userId']
        );
        $userId = $helper->ask($input, $output, $question);
        if ($userId !== $userToDelete['userId']) {
            $key = array_search($userId, array_column($usersWithContributions, 'userId'));
            $userToDelete = $usersWithContributions[$key];
            $userId = $userToDelete['userId'];
        }

        $io->warning(
            sprintf(
                'You will delete user %s with %d contribution(s)',
                $userToDelete['userId'],
                $userToDelete['totalContributions']
            )
        );
        $question = new ConfirmationQuestion('Continue with this action ? ', false, '/^(y|j)/i');

        if ($helper->ask($input, $output, $question)) {
            $user = $this->userRepository->find($userId);
            $this->deleteAccountMutation->hardDeleteUserContributionsInActiveSteps($user);
            $this->em->refresh($user);
            $this->em->remove($user);
            $this->em->flush();

            $io->success(sprintf('User %s has been successfully deleted', $userToDelete['userId']));
        }
    }

    private function countUserContributions(array $users, SymfonyStyle $io): array
    {
        $rows = [];
        $columnNumber = 1;
        foreach ($users as $user) {
            $user = $this->userRepository->find($user['userId']);
            $totalContributions = $this->countResolver->__invoke($user);
            $rows[] = [
                'userId' => $user->getId(),
                'userEmail' => $user->getEmail(),
                'totalContributions' => $totalContributions,
                'userCreateAt' => $user->getCreatedAt()->format('Y-m-d H:i:s'),
                'userUpdatedAt' => $user->getUpdatedAt()
                    ? $user->getUpdatedAt()->format('Y-m-d H:i:s')
                    : 'NULL',
            ];
            ++$columnNumber;
        }

        $this->generateTable($io, $rows, [
            'userId',
            'userEmail',
            'totalContributions',
            'userCreatedAt',
            'userUpdatedAt',
        ]);

        return $rows;
    }

    private function findDuplicatesUsers(
        string $sso,
        InputInterface $input,
        OutputInterface $output,
        SymfonyStyle $io
    ): ?array {
        $ssoId = $sso . '_id';
        $header = ['userId', $ssoId, 'email', 'duplicates'];

        $duplicatesUsers = $this->userRepository->findDuplicatesUsers();
        $header[] = 'sso';

        if (0 === \count($duplicatesUsers)) {
            $output->writeln('There is no duplicates users on this instance');

            return null;
        }

        $this->generateTable($io, $duplicatesUsers, $header);

        return compact('ssoId', 'duplicatesUsers');
    }

    private function generateTable(SymfonyStyle $io, array $rows, array $header)
    {
        $style = clone Table::getStyleDefinition('symfony-style-guide');
        $style->setCellHeaderFormat('<info>%s</info>');
        $header = array_merge(['rowNumber'], $header);
        $table = new Table($io);
        $table->setHeaders($header);
        $rowNumber = 1;
        foreach ($rows as $row) {
            $row = array_merge([$rowNumber], $row);
            $table->addRow($row);
            ++$rowNumber;
        }
        $table->setStyle($style);
        $table->render();
        $io->newLine();
    }
}