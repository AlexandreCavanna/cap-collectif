<?php

namespace spec\Capco\AppBundle\GraphQL\DataLoader\Proposal;

use Capco\AppBundle\Cache\RedisTagCache;
use Capco\AppBundle\DataCollector\GraphQLCollector;
use Capco\AppBundle\Entity\Follower;
use Capco\AppBundle\Entity\Proposal;
use Capco\AppBundle\GraphQL\DataLoader\Proposal\ProposalViewerIsFollowingDataLoader;
use Capco\AppBundle\Repository\FollowerRepository;
use Capco\UserBundle\Entity\User;
use GraphQL\Executor\Promise\Adapter\SyncPromiseAdapter;
use GraphQL\Executor\Promise\Promise;
use Overblog\PromiseAdapter\PromiseAdapterInterface;
use PhpSpec\ObjectBehavior;
use Psr\Log\LoggerInterface;
use Symfony\Component\Stopwatch\Stopwatch;

class ProposalViewerIsFollowingDataLoaderSpec extends ObjectBehavior
{
    public function let(
        PromiseAdapterInterface $promiseFactory,
        RedisTagCache $cache,
        LoggerInterface $logger,
        FollowerRepository $followerRepository,
        GraphQLCollector $collector,
        Stopwatch $stopwatch
    ) {
        $this->beConstructedWith(
            $promiseFactory,
            $cache,
            $logger,
            $followerRepository,
            'prefix',
            60,
            false,
            $collector,
            $stopwatch,
            true
        );
    }

    public function it_is_initializable()
    {
        $this->shouldHaveType(ProposalViewerIsFollowingDataLoader::class);
    }

    public function it_resolve(
        Proposal $proposal1,
        Proposal $proposal2,
        User $viewer,
        FollowerRepository $followerRepository,
        Follower $follower1,
        Follower $follower2,
        PromiseAdapterInterface $promiseFactory
    ) {
        $proposal1->getId()->willReturn('proposal1');
        $proposal2->getId()->willReturn('proposal2');
        $keys = [
            [
                'proposal' => $proposal1,
                'viewer' => $viewer,
            ],
            [
                'proposal' => $proposal2,
                'viewer' => $viewer,
            ],
        ];
        $follower1->getProposal()->willReturn($proposal1);
        $follower2->getProposal()->willReturn($proposal2);

        $followerRepository
            ->getByProposalIdsAndUser(['proposal1', 'proposal2'], $viewer)
            ->willReturn([$follower1, $follower2])
        ;

        $promise = new Promise(null, new SyncPromiseAdapter());
        $promiseFactory
            ->createAll([true, true])
            ->shouldBeCalled()
            ->willReturn($promise)
        ;

        $this->all($keys)->shouldReturn($promise);
    }
}
