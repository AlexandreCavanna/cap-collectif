<?php

namespace Capco\AppBundle\Notifier;

use Capco\AppBundle\Entity\Project;
use Capco\AppBundle\Entity\Reply;
use Capco\AppBundle\Mailer\Message\Project\QuestionnaireAcknowledgeReplyMessage;
use Capco\AppBundle\Mailer\Message\User\UserAdminConfirmationMessage;
use Capco\AppBundle\Mailer\Message\User\UserConfirmEmailChangedMessage;
use Capco\AppBundle\Mailer\Message\User\UserExpiredWithContributionsMessage;
use Capco\AppBundle\Mailer\Message\User\UserExpiredWithNoContributionsMessage;
use Capco\AppBundle\Mailer\Message\User\UserNewEmailConfirmationMessage;
use Capco\UserBundle\Entity\User;

final class UserNotifier extends BaseNotifier
{
    public function acknowledgeReply(Project $project, Reply $reply): void
    {
        $this->mailer->sendMessage(
            QuestionnaireAcknowledgeReplyMessage::create(
                $project,
                $reply,
                $reply->getAuthor()->getEmail()
            )
        );
    }

    public function adminConfirmation(User $user): void
    {
        $this->mailer->sendMessage(
            UserAdminConfirmationMessage::create(
                $user,
                $this->siteParams->getValue('global.site.fullname'),
                $this->userResolver->resolveRegistrationConfirmationUrl($user),
                $user->getEmail()
            )
        );
    }

    public function newEmailConfirmation(User $user): void
    {
        $this->mailer->sendMessage(
            UserNewEmailConfirmationMessage::create(
                $user,
                $this->userResolver->resolveConfirmNewEmailUrl($user),
                $user->getNewEmailToConfirm()
            )
        );
        $this->mailer->sendMessage(
            UserConfirmEmailChangedMessage::create(
                $user,
                $user->getEmail()
            )
        );
    }

    public function emailConfirmation(User $user): void
    {
        $this->mailer->sendMessage(
            UserNewEmailConfirmationMessage::create(
                $user,
                $this->userResolver->resolveRegistrationConfirmationUrl($user),
                $user->getNewEmailToConfirm()
            )
        );
    }

    public function expired(User $user, bool $contributionDeleted): void
    {
        $adminEmail = $this->siteParams->getValue('admin.mail.notifications.receive_address');
        if ($contributionDeleted) {
            $this->mailer->sendMessage(
                UserExpiredWithContributionsMessage::create(
                    $user,
                    $this->userResolver->resolveRegistrationConfirmationUrl($user),
                    $adminEmail,
                    $user->getEmail()
                )
            );
        } else {
            $this->mailer->sendMessage(
                UserExpiredWithNoContributionsMessage::create(
                    $user,
                    $this->userResolver->resolveRegistrationConfirmationUrl($user),
                    $adminEmail,
                    $user->getEmail()
                )
            );
        }
    }
}
