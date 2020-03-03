<?php

namespace Capco\AppBundle\GraphQL\Mutation;

use Capco\AppBundle\Entity\AbstractVote;
use Capco\AppBundle\Entity\Argument;
use Capco\AppBundle\Entity\Comment;
use Capco\AppBundle\Entity\CommentVote;
use Capco\AppBundle\Entity\Event;
use Capco\AppBundle\Entity\Opinion;
use Capco\AppBundle\Entity\Proposal;
use Capco\AppBundle\Entity\Reply;
use Capco\AppBundle\Entity\Source;
use Capco\AppBundle\EventListener\SoftDeleteEventListener;
use Capco\AppBundle\GraphQL\DataLoader\Proposal\ProposalAuthorDataLoader;
use Capco\AppBundle\Helper\RedisStorageHelper;
use Capco\AppBundle\Repository\AbstractResponseRepository;
use Capco\AppBundle\Repository\CommentRepository;
use Capco\AppBundle\Repository\EventRepository;
use Capco\AppBundle\Repository\MediaResponseRepository;
use Capco\AppBundle\Repository\NewsletterSubscriptionRepository;
use Capco\AppBundle\Repository\ProposalEvaluationRepository;
use Capco\AppBundle\Repository\ReportingRepository;
use Capco\AppBundle\Repository\UserGroupRepository;
use Capco\AppBundle\Repository\ValueResponseRepository;
use Capco\MediaBundle\Entity\Media;
use Capco\MediaBundle\Repository\MediaRepository;
use Capco\UserBundle\Doctrine\UserManager;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Sonata\MediaBundle\Provider\ImageProvider;
use Symfony\Component\Translation\TranslatorInterface;

abstract class BaseDeleteUserMutation extends BaseDeleteMutation
{
    /**
     * @var EntityManagerInterface
     */
    protected $em;
    protected $mediaProvider;
    protected $translator;
    protected $originalEventListeners = [];
    protected $redisStorageHelper;
    protected $groupRepository;
    protected $userManager;
    protected $proposalAuthorDataLoader;
    protected $commentRepository;
    protected $proposalEvaluationRepository;
    protected $abstractResponseRepository;
    protected $newsletterSubscriptionRepository;
    protected $mediaRepository;
    protected $mediaResponseRepository;
    protected $valueResponseRepository;
    protected $reportingRepository;
    protected $eventRepository;

    public function __construct(
        EntityManagerInterface $em,
        ImageProvider $mediaProvider,
        TranslatorInterface $translator,
        RedisStorageHelper $redisStorageHelper,
        UserGroupRepository $groupRepository,
        UserManager $userManager,
        ProposalAuthorDataLoader $proposalAuthorDataLoader,
        CommentRepository $commentRepository,
        ProposalEvaluationRepository $proposalEvaluationRepository,
        AbstractResponseRepository $abstractResponseRepository,
        NewsletterSubscriptionRepository $newsletterSubscriptionRepository,
        MediaRepository $mediaRepository,
        MediaResponseRepository $mediaResponseRepository,
        ValueResponseRepository $valueResponseRepository,
        ReportingRepository $reportingRepository,
        EventRepository $eventRepository
    ) {
        parent::__construct($em, $mediaProvider);
        $this->translator = $translator;
        $this->redisStorageHelper = $redisStorageHelper;
        $this->groupRepository = $groupRepository;
        $this->userManager = $userManager;
        $this->proposalAuthorDataLoader = $proposalAuthorDataLoader;
        $this->commentRepository = $commentRepository;
        $this->proposalEvaluationRepository = $proposalEvaluationRepository;
        $this->abstractResponseRepository = $abstractResponseRepository;
        $this->newsletterSubscriptionRepository = $newsletterSubscriptionRepository;
        $this->mediaRepository = $mediaRepository;
        $this->mediaResponseRepository = $mediaResponseRepository;
        $this->valueResponseRepository = $valueResponseRepository;
        $this->reportingRepository = $reportingRepository;
        $this->eventRepository = $eventRepository;
    }

    public function softDelete(User $user): void
    {
        $contributions = $user->getContributions();
        $deletedBodyText = $this->translator->trans(
            'deleted-content-by-author',
            [],
            'CapcoAppBundle'
        );
        $deletedTitleText = $this->translator->trans('deleted-title', [], 'CapcoAppBundle');

        $reports = $this->reportingRepository->findBy(['Reporter' => $user]);
        $events = $this->eventRepository->findBy(['author' => $user]);

        foreach ($contributions as $contribution) {
            if (method_exists($contribution, 'setTitle')) {
                $contribution->setTitle($deletedTitleText);
            }
            if (method_exists($contribution, 'setBody')) {
                $contribution->setBody($deletedBodyText);
            }
            if (method_exists($contribution, 'setSummary')) {
                $contribution->setSummary(null);
            }
            if (method_exists($contribution, 'getMedia') && $contribution->getMedia()) {
                $this->removeObjectMedia($contribution);
            }
            if ($contribution instanceof Proposal) {
                $this->deleteResponsesContent($contribution, $deletedBodyText);
                $contribution->setAddress(null);
                $contribution->setEstimation(null);
                $contribution->setCategory(null);
                $contribution->setTheme(null);
                $contribution->setDistrict(null);
            }
        }

        foreach ($reports as $report) {
            $report->setBody($deletedBodyText);
        }

        foreach ($events as $event) {
            $this->em->remove($event);
        }

        $this->redisStorageHelper->recomputeUserCounters($user);
    }

    public function hardDeleteUserContributionsInActiveSteps(User $user, bool $dryRun = false): int
    {
        // Disable the built-in softdelete
        $filters = $this->em->getFilters();
        if ($filters->isEnabled('softdeleted')) {
            $filters->disable('softdeleted');
        }
        $this->disableListeners();

        $deletedBodyText = $this->translator->trans(
            'deleted-content-by-author',
            [],
            'CapcoAppBundle'
        );
        $contributions = $user->getContributions();
        $toDeleteList = [];

        foreach ($contributions as $contribution) {
            if ($contribution instanceof AbstractVote) {
                if ($contribution instanceof CommentVote) {
                    $toDeleteList[] = $contribution;
                } elseif (
                    method_exists($contribution->getRelated(), 'getStep') &&
                    $contribution->getRelated() &&
                    $contribution->getRelated()->getStep() &&
                    $contribution
                        ->getRelated()
                        ->getStep()
                        ->canContribute($user)
                ) {
                    $toDeleteList[] = $contribution;
                }
            }

            if ($contribution instanceof Comment) {
                $hasChild = $this->commentRepository->findOneBy([
                    'parent' => $contribution->getId()
                ]);
                if ($hasChild) {
                    $contribution->setBody($deletedBodyText);
                } else {
                    $toDeleteList[] = $contribution;
                }
            }
            if (
                ($contribution instanceof Proposal ||
                    $contribution instanceof Opinion ||
                    $contribution instanceof Source ||
                    $contribution instanceof Argument) &&
                $contribution->getStep() &&
                $contribution->getStep()->canContribute($user)
            ) {
                $toDeleteList[] = $contribution;
                if (!$dryRun) {
                    $proposalEvaluations = $this->proposalEvaluationRepository->findBy([
                        'proposal' => $contribution->getId()
                    ]);
                    foreach ($proposalEvaluations as $a) {
                        $this->em->remove($a);
                    }

                    $responses = $this->abstractResponseRepository->findBy([
                        'proposal' => $contribution->getId()
                    ]);
                    foreach ($responses as $a) {
                        $this->em->remove($a);
                    }
                }
            }

            if (!$dryRun && method_exists($contribution, 'getMedia') && $contribution->getMedia()) {
                $this->removeObjectMedia($contribution);
            }
        }

        $count = \count($toDeleteList);
        if (!$dryRun) {
            foreach ($toDeleteList as $toDelete) {
                $this->em->remove($toDelete);
            }
        }
        $this->em->flush();
        $this->enableListeners();

        $this->redisStorageHelper->recomputeUserCounters($user);

        return $count;
    }

    public function anonymizeUser(User $user): void
    {
        $usernameDeleted = $this->translator->trans('deleted-user', [], 'CapcoAppBundle');
        $newsletter = $this->newsletterSubscriptionRepository->findOneBy([
            'email' => $user->getEmail()
        ]);
        $userGroups = $this->groupRepository->findBy(['user' => $user]);

        if ($newsletter) {
            $this->em->remove($newsletter);
        }

        if ($userGroups) {
            foreach ($userGroups as $userGroup) {
                $this->em->remove($userGroup);
            }
        }

        $user->setEmail(null);
        $user->setEmailCanonical(null);
        $user->setUsername($usernameDeleted);
        $user->setDeletedAccountAt(new \DateTime());
        $user->setPlainPassword(null);
        $user->clearLastLogin();

        $user->setFacebookId(null);
        $user->setFacebookUrl(null);
        $user->setFacebookData(null);
        $user->setFacebookName(null);
        $user->setFacebookAccessToken(null);

        $user->setTwitterId(null);
        $user->setTwitterUrl(null);
        $user->setTwitterData(null);
        $user->setTwitterName(null);
        $user->setTwitterAccessToken(null);

        $user->setGoogleId(null);
        $user->setGplusData(null);
        $user->setGplusName(null);
        $user->setGoogleAccessToken(null);
        $user->setGplusData(null);

        $user->setAddress(null);
        $user->setAddress2(null);
        $user->setZipCode(null);
        $user->setNeighborhood(null);
        $user->setPhone(null);
        $user->setCity(null);
        $user->setBiography(null);
        $user->setDateOfBirth(null);
        $user->setFirstname(null);
        $user->setLastname(null);
        $user->setWebsite(null);
        $user->setGender(null);
        $user->setLocale(null);
        $user->setTimezone(null);
        $user->setLocked(true);
        if ($user->getMedia()) {
            $this->removeObjectMedia($user);
        }

        $contributions = $user->getContributions();
        foreach ($contributions as $contribution) {
            if ($contribution instanceof Proposal) {
                $this->proposalAuthorDataLoader->invalidate($contribution);
            }
        }

        $this->userManager->updateUser($user);
    }

    private function enableListeners(): void
    {
        foreach ($this->originalEventListeners as $eventName => $listener) {
            $this->em->getEventManager()->addEventListener($eventName, $listener);
        }
    }

    private function removeObjectMedia($object): void
    {
        /** @var Media $media */
        $media = $this->mediaRepository->find($object->getMedia()->getId());
        $this->removeMedia($media);
        $object->setMedia(null);
    }

    private function deleteResponsesContent(Proposal $proposal, string $deletedBodyText): void
    {
        $valueResponses = $this->valueResponseRepository->findBy(['proposal' => $proposal]);
        $mediaResponses = $this->mediaResponseRepository->findBy(['proposal' => $proposal]);
        /** @var Reply $reply */
        foreach ($valueResponses as $reply) {
            $reply->setValue($deletedBodyText);
        }
        foreach ($mediaResponses as $response) {
            $response->getMedias()->clear();
        }
        foreach ($mediaResponses as $response) {
            $medias = $response->getMedias();
            foreach ($medias as $media) {
                $this->removeMedia($media);
            }
        }
    }

    private function disableListeners(): void
    {
        foreach ($this->em->getEventManager()->getListeners() as $eventName => $listeners) {
            foreach ($listeners as $listener) {
                if ($listener instanceof SoftDeleteEventListener) {
                    // store the event listener, that gets removed
                    $this->originalEventListeners[$eventName] = $listener;

                    // remove the SoftDeletableSubscriber event listener
                    $this->em->getEventManager()->removeEventListener($eventName, $listener);
                }
            }
        }
    }
}
