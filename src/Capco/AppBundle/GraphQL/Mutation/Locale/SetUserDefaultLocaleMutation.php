<?php

namespace Capco\AppBundle\GraphQL\Mutation\Locale;

use Capco\AppBundle\Repository\LocaleRepository;
use Capco\UserBundle\Entity\User;
use Capco\UserBundle\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Overblog\GraphQLBundle\Definition\Argument;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;
use Overblog\GraphQLBundle\Relay\Node\GlobalId;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class SetUserDefaultLocaleMutation implements MutationInterface
{
    private LocaleRepository $localeRepository;
    private EntityManagerInterface $entityManager;
    private UserRepository $userRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        LocaleRepository $localRepository
    ) {
        $this->localeRepository = $localRepository;
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
    }

    public function __invoke(Argument $args, User $viewer): array
    {
        $code = $args->offsetGet('code');
        if ($viewer->isAdmin() && null !== $args->offsetGet('userId')) {
            $userId = $args->offsetGet('userId');
            $user = $this->userRepository->find(GlobalId::fromGlobalId($userId)['id']);
            if (null === $user) {
                throw new BadRequestHttpException('The userId provided does not match any user.');
            }
        }
        $updatedUser = $this->setUserDefaultLocale($user ?? $viewer, $code);
        if (null === $updatedUser) {
            throw new BadRequestHttpException("The locale with code ${code} does not exist.");
        }

        return compact('code');
    }

    public function setUserDefaultLocale(User $user, ?string $code): ?User
    {
        if (null === $user) {
            throw new BadRequestHttpException('You must provide a userId or be connected.');
        }

        if ($code && !$this->localeRepository->findOneBy(['code' => $code, 'published' => true])) {
            throw new BadRequestHttpException("The locale with code ${code} does not exist or is not enabled.");
        }

        $user->setLocale($code);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }
}
