<?php

namespace Capco\AppBundle\Processor;

use Swarrot\Broker\Message;
use Swarrot\Processor\ProcessorInterface;
use Capco\AppBundle\Manager\Notify;
use Capco\AppBundle\Repository\ProposalRepository;
use Doctrine\ORM\EntityManager;

class ProposalDeleteProcessor implements ProcessorInterface
{
    private $em;
    private $proposalRepository;
    private $notifer;

    public function __construct(EntityManager $em, ProposalRepository $proposalRepository, Notify $notifier)
    {
        $this->em = $em;
        $this->proposalRepository = $proposalRepository;
        $this->notifier = $notifier;
    }

    public function process(Message $message, array $options)
    {
        $json = json_decode($message->getBody(), true);
        $this->em->getFilters()->disable('softdeleteable');
        $proposal = $this->proposalRepository->find($json['proposalId']);
        $this->notifier->notifyProposal($proposal, 'delete');

        return true;
    }
}
