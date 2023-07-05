<?php

namespace Capco\AppBundle\GraphQL\Mutation;

use Capco\AppBundle\Elasticsearch\Indexer;
use Capco\AppBundle\Entity\Proposal;
use Capco\AppBundle\Form\ProposalFusionType;
use Capco\AppBundle\GraphQL\Resolver\GlobalIdResolver;
use Capco\AppBundle\Repository\ProposalRepository;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Overblog\GraphQLBundle\Definition\Argument;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;
use Overblog\GraphQLBundle\Error\UserError;
use Psr\Log\LoggerInterface;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class CreateProposalFusionMutation implements MutationInterface
{
    private $em;
    private $formFactory;
    private $proposalRepo;
    private $translator;
    private $globalIdResolver;
    private $logger;
    private $indexer;

    public function __construct(
        EntityManagerInterface $em,
        FormFactoryInterface $formFactory,
        ProposalRepository $proposalRepo,
        TranslatorInterface $translator,
        GlobalIdResolver $globalIdResolver,
        LoggerInterface $logger,
        Indexer $indexer
    ) {
        $this->em = $em;
        $this->formFactory = $formFactory;
        $this->proposalRepo = $proposalRepo;
        $this->translator = $translator;
        $this->globalIdResolver = $globalIdResolver;
        $this->logger = $logger;
        $this->indexer = $indexer;
    }

    public function __invoke(Argument $input, User $author): array
    {
        $proposalIds = array_unique($input->getArrayCopy()['fromProposals']);
        $title = $input->offsetGet('title');
        $body = $input->offsetGet('description');

        if (\count($proposalIds) < 2) {
            throw new UserError('You must specify at least 2 proposals to merge.');
        }

        $proposalForm = null;
        $proposalUuids = [];
        foreach ($proposalIds as $key => $id) {
            $child = $this->globalIdResolver->resolve($id, $author);
            if (!$child) {
                throw new UserError('Unknown proposal to merge with id: ' . var_export($id, true));
            }
            $proposalUuids[] = $child->getId();
            if (0 === $key) {
                $proposalForm = $child->getProposalForm();
            } elseif ($child->getProposalForm() !== $proposalForm) {
                throw new UserError('All proposals to merge should have the same proposalForm.');
            }
        }

        $defaultTitle = $this->translator->trans('untitled-proposal', [], 'CapcoAppBundle');

        $proposal = (new Proposal())
            ->setAuthor($author)
            ->setTitle($title ?? $defaultTitle)
            ->setProposalForm($proposalForm)
        ;

        if ($body) {
            $proposal->setBody($body);
        }

        $form = $this->formFactory->create(ProposalFusionType::class, $proposal, [
            'proposalForm' => $proposalForm,
        ]);
        $form->submit(['childConnections' => $proposalUuids], false);

        if (!$form->isValid()) {
            throw new UserError('Invalid data.');
        }

        if (
            $proposalForm->getStep()
            && ($defaultStatus = $proposalForm->getStep()->getDefaultStatus())
        ) {
            $proposal->setStatus($defaultStatus);
        }

        $this->em->persist($proposal);
        $this->em->flush();
        $this->indexer->index(Proposal::class, $proposal);
        $this->indexer->finishBulk();

        return ['proposal' => $proposal];
    }
}
