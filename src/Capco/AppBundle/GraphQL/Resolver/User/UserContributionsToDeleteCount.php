<?php

namespace Capco\AppBundle\GraphQL\Resolver\User;

use Capco\AppBundle\GraphQL\Mutation\DeleteAccountMutation;
use Capco\UserBundle\Entity\User;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;

class UserContributionsToDeleteCount implements QueryInterface
{
    private $deleteAccountMutation;

    public function __construct(DeleteAccountMutation $deleteAccountMutation)
    {
        $this->deleteAccountMutation = $deleteAccountMutation;
    }

    public function __invoke(User $user): int
    {
        return $this->deleteAccountMutation->countContributionsToDelete($user);
    }
}
