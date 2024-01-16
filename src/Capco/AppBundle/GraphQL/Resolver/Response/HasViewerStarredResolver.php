<?php

namespace Capco\AppBundle\GraphQL\Resolver\Response;

use Capco\AppBundle\Entity\Responses\AbstractResponse;
use Capco\UserBundle\Entity\User;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;

class HasViewerStarredResolver implements QueryInterface
{
    public function __invoke(AbstractResponse $response, User $user): bool
    {
        return $response->getStarCrafters()->contains($user);
    }
}
