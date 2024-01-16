<?php

namespace Capco\AppBundle\GraphQL\Resolver\User;

use Capco\AppBundle\GraphQL\Resolver\Traits\ResolverTrait;
use Capco\UserBundle\Entity\User;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;

class UserRolesResolver implements QueryInterface
{
    use ResolverTrait;

    public function __invoke(User $user, $viewer): array
    {
        $viewer = $this->preventNullableViewer($viewer);
        if ($user === $viewer || $viewer->isAdmin()) {
            return $user->getRoles();
        }

        return [];
    }
}
