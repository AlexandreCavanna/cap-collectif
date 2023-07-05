<?php

namespace Capco\AppBundle\GraphQL\Resolver\User;

use Capco\AppBundle\Entity\NewsletterSubscription;
use Capco\AppBundle\Repository\NewsletterSubscriptionRepository;
use Capco\UserBundle\Entity\User;
use Overblog\GraphQLBundle\Definition\Resolver\ResolverInterface;

class UserIsSubscribedToNewsLetterResolver implements ResolverInterface
{
    protected NewsletterSubscriptionRepository $newLetterRepository;

    public function __construct(NewsletterSubscriptionRepository $newsletterSubscriptionRepository)
    {
        $this->newLetterRepository = $newsletterSubscriptionRepository;
    }

    public function __invoke(User $user): bool
    {
        /** @var NewsletterSubscription $newsLetter */
        $subscription = $this->newLetterRepository->findOneBy(['email' => $user->getEmail()]);
        if (!$subscription) {
            return false;
        }

        return $subscription->getIsEnabled();
    }
}
