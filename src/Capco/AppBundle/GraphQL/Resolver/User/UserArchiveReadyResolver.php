<?php

namespace Capco\AppBundle\GraphQL\Resolver\User;

use Capco\AppBundle\Repository\UserArchiveRepository;
use Capco\UserBundle\Entity\User;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;

class UserArchiveReadyResolver implements QueryInterface
{
    protected $userArchiveRepository;

    public function __construct(UserArchiveRepository $userArchiveRepository)
    {
        $this->userArchiveRepository = $userArchiveRepository;
    }

    public function __invoke(User $viewer): bool
    {
        $lastArchive = $this->userArchiveRepository->getLastForUser($viewer);

        if (!$lastArchive) {
            return false;
        }

        return $lastArchive->isReady();
    }
}
