<?php

namespace Capco\AppBundle\GraphQL\Mutation\Mailing;

use Capco\AppBundle\Entity\EmailingCampaign;
use Capco\AppBundle\Enum\EmailingCampaignStatus;
use Capco\AppBundle\GraphQL\Resolver\GlobalIdResolver;
use Capco\AppBundle\Mailer\EmailingCampaignSender;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use GraphQL\Error\UserError;
use Overblog\GraphQLBundle\Definition\Argument;

class SendEmailingCampaignMutation extends AbstractEmailingCampaignMutation
{
    private EmailingCampaignSender $sender;
    private EntityManagerInterface $entityManager;

    public function __construct(
        GlobalIdResolver $resolver,
        EmailingCampaignSender $sender,
        EntityManagerInterface $entityManager
    ) {
        parent::__construct($resolver);
        $this->sender = $sender;
        $this->entityManager = $entityManager;
    }

    public function __invoke(Argument $input, User $viewer): array
    {
        $emailingCampaign = null;
        $error = null;

        try {
            $emailingCampaign = $this->getSendableCampaign($input, $viewer);
            $emailingCampaign->getSendAt()
                ? $this->planEmailingCampaign($emailingCampaign)
                : $this->sendEmailingCampaign($emailingCampaign);
            $this->entityManager->flush();
        } catch (UserError $exception) {
            $emailingCampaign = null;
            $error = $exception->getMessage();
        }

        return compact('emailingCampaign', 'error');
    }

    private function planEmailingCampaign(EmailingCampaign $emailingCampaign): EmailingCampaign
    {
        $emailingCampaign->setStatus(EmailingCampaignStatus::PLANNED);

        return $emailingCampaign;
    }

    private function sendEmailingCampaign(EmailingCampaign $emailingCampaign): EmailingCampaign
    {
        return $this->sender->send($emailingCampaign);
    }
}
