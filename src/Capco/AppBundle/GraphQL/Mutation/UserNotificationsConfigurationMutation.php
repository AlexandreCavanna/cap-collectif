<?php

namespace Capco\AppBundle\GraphQL\Mutation;

use Capco\AppBundle\Form\UserNotificationsConfigurationType;
use Capco\AppBundle\GraphQL\Resolver\Traits\MutationTrait;
use Capco\AppBundle\Mailer\SendInBlue\SendInBluePublisher;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use GraphQL\Error\UserError;
use Overblog\GraphQLBundle\Definition\Argument;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Form\FormFactoryInterface;

class UserNotificationsConfigurationMutation implements MutationInterface
{
    use MutationTrait;
    private EntityManagerInterface $entityManager;
    private LoggerInterface $logger;
    private FormFactoryInterface $formFactory;
    private SendInBluePublisher $sendInBluePublisher;

    public function __construct(
        EntityManagerInterface $entityManager,
        LoggerInterface $logger,
        FormFactoryInterface $formFactory,
        SendInBluePublisher $sendInBluePublisher
    ) {
        $this->entityManager = $entityManager;
        $this->formFactory = $formFactory;
        $this->logger = $logger;
        $this->sendInBluePublisher = $sendInBluePublisher;
    }

    public function __invoke(Argument $args, User $user): array
    {
        $this->formatInput($args);
        $userNotificationsConfiguration = $user->getNotificationsConfiguration();
        $wasConsentingInternalComm = $userNotificationsConfiguration->isConsentInternalCommunication();
        $form = $this->formFactory->create(
            UserNotificationsConfigurationType::class,
            $userNotificationsConfiguration
        );
        $values = $args->getArrayCopy();
        $form->submit($values);
        if (!$form->isValid()) {
            $this->logger->error(
                static::class .
                    ' changeUserNotification: ' .
                    (string) $form->getErrors(true, false)
            );

            throw new UserError('Could not update your notification settings.');
        }

        if (true === $values['consentInternalCommunication'] && !$wasConsentingInternalComm && $user->isEmailConfirmed()) {
            $this->sendInBluePublisher->pushToSendinblue('addEmailToSendInBlue', ['user' => $user->getEmail()]);
        } elseif (false === $values['consentInternalCommunication'] && $wasConsentingInternalComm && $user->isEmailConfirmed()) {
            $this->sendInBluePublisher->pushToSendinblue('blackListUser', ['email' => $user->getEmail()]);
        }

        $this->entityManager->flush();

        return ['user' => $userNotificationsConfiguration->getUser()];
    }
}
