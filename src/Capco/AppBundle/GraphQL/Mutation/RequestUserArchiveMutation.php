<?php

namespace Capco\AppBundle\GraphQL\Mutation;

use Capco\AppBundle\CapcoAppBundleMessagesTypes;
use Capco\AppBundle\Entity\UserArchive;
use Capco\AppBundle\GraphQL\Resolver\Traits\MutationTrait;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Overblog\GraphQLBundle\Definition\Argument;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;
use Swarrot\Broker\Message;
use Swarrot\SwarrotBundle\Broker\Publisher;

class RequestUserArchiveMutation implements MutationInterface
{
    use MutationTrait;
    protected $em;
    protected $publisher;

    public function __construct(EntityManagerInterface $em, Publisher $publisher)
    {
        $this->em = $em;
        $this->publisher = $publisher;
    }

    public function __invoke(Argument $input, User $viewer): array
    {
        $this->formatInput($input);
        $archive = new UserArchive();
        $viewer->addArchive($archive);
        $this->em->flush();

        $this->publisher->publish(
            CapcoAppBundleMessagesTypes::USER_ARCHIVE_REQUEST,
            new Message(
                json_encode([
                    'userArchiveId' => $archive->getId(),
                ])
            )
        );

        return compact('viewer');
    }
}
