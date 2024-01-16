<?php

namespace Capco\AppBundle\GraphQL\Resolver\Event;

use Capco\AppBundle\DTO\GoogleMapsAddress;
use Capco\AppBundle\Entity\Event;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;

class EventAddressResolver implements QueryInterface
{
    public function __invoke(Event $event): ?GoogleMapsAddress
    {
        if ($addressJson = $event->getAddressJson()) {
            return GoogleMapsAddress::fromApi($addressJson);
        }

        return null;
    }
}
