<?php

namespace Capco\AppBundle\GraphQL\Resolver;

use Capco\AppBundle\Entity\Interfaces\TimeRangeable;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;

class TimeRangeResolver implements QueryInterface
{
    public function __invoke(TimeRangeable $entity): array
    {
        return [
            'startAt' => $entity->getStartAt(),
            'endAt' => $entity->getEndAt(),
            'hasStarted' => $entity->hasStarted(),
            'hasEnded' => $entity->hasEnded(),
            'remainingTime' => $entity->getRemainingTime(),
            'lastOneDay' => $entity->lastOneDay(),
            'isOpen' => $entity->isOpen(),
            'isClosed' => $entity->isClosed(),
            'isFuture' => $entity->isFuture(),
            'isTimeless' => $entity->isTimeless(),
        ];
    }
}
