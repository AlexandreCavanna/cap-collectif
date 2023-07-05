<?php

namespace Capco\AppBundle\GraphQL\Mutation;

use Capco\AppBundle\Helper\RedisStorageHelper;
use Capco\AppBundle\Repository\OpinionVersionRepository;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Overblog\GraphQLBundle\Definition\Argument as Arg;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;
use Overblog\GraphQLBundle\Error\UserError;
use Overblog\GraphQLBundle\Relay\Node\GlobalId;

class DeleteVersionMutation implements MutationInterface
{
    private $em;
    private $versionRepo;
    private $redisStorage;

    public function __construct(
        EntityManagerInterface $em,
        OpinionVersionRepository $versionRepo,
        RedisStorageHelper $redisStorage
    ) {
        $this->em = $em;
        $this->versionRepo = $versionRepo;
        $this->redisStorage = $redisStorage;
    }

    public function __invoke(Arg $input, User $user): array
    {
        $versionGlobalId = $input->offsetGet('versionId');
        $versionId = GlobalId::fromGlobalId($versionGlobalId)['id'];
        $version = $this->versionRepo->find($versionId);

        if (!$version) {
            throw new UserError("Unknown version with id: {$versionId}");
        }

        if ($user !== $version->getAuthor()) {
            throw new UserError('You are not the author of version with id: ' . $versionId);
        }

        $opinion = $version->getParent();

        $this->em->remove($version);
        $this->em->flush();
        $this->redisStorage->recomputeUserCounters($user);

        return ['opinion' => $opinion, 'deletedVersionId' => $versionGlobalId];
    }
}
