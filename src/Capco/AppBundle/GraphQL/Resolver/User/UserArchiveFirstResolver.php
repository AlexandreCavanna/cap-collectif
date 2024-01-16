<?php

namespace Capco\AppBundle\GraphQL\Resolver\User;

use Capco\AppBundle\Repository\UserArchiveRepository;
use Capco\UserBundle\Entity\User;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;

class UserArchiveFirstResolver implements QueryInterface
{
    protected $userArchiveRepository;

    public function __construct(UserArchiveRepository $userArchiveRepository)
    {
        $this->userArchiveRepository = $userArchiveRepository;
    }

    public function __invoke(User $viewer): bool
    {
        $lastArchive = $this->userArchiveRepository->getLastForUser($viewer);

        return null === $lastArchive;
    }
}
