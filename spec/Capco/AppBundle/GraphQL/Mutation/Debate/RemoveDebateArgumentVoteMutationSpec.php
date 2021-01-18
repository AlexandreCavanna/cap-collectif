<?php

namespace spec\Capco\AppBundle\GraphQL\Mutation\Debate;

use Capco\AppBundle\Entity\Debate\DebateArgument;
use Capco\AppBundle\Entity\Debate\DebateArgumentVote;
use Capco\AppBundle\GraphQL\Mutation\Debate\RemoveDebateArgumentVoteMutation;
use Capco\AppBundle\Repository\Debate\DebateArgumentVoteRepository;
use Capco\AppBundle\Security\DebateArgumentVoter;
use Capco\UserBundle\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use PhpSpec\ObjectBehavior;
use Doctrine\ORM\EntityManagerInterface;
use Capco\AppBundle\GraphQL\Resolver\GlobalIdResolver;
use Overblog\GraphQLBundle\Definition\Argument as Arg;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class RemoveDebateArgumentVoteMutationSpec extends ObjectBehavior
{
    public function let(
        DebateArgumentVoteRepository $repository,
        EntityManagerInterface $em,
        AuthorizationCheckerInterface $authorizationChecker,
        GlobalIdResolver $globalIdResolver
    ) {
        $this->beConstructedWith($em, $globalIdResolver, $authorizationChecker, $repository);
    }

    public function it_is_initializable()
    {
        $this->shouldHaveType(RemoveDebateArgumentVoteMutation::class);
    }

    public function it_removes_vote(
        EntityManagerInterface $em,
        GlobalIdResolver $globalIdResolver,
        DebateArgumentVoteRepository $repository,
        AuthorizationCheckerInterface $authorizationChecker,
        Arg $input,
        DebateArgument $debateArgument,
        DebateArgumentVote $debateArgumentVote,
        User $viewer
    ) {
        $debateArgumentId = 'debateArgumentId';
        $debateArgumentVoteId = 'debateArgumentVoteId';
        $input->offsetGet('debateArgumentId')->willReturn($debateArgumentId);
        $globalIdResolver->resolve($debateArgumentId, $viewer)->willReturn($debateArgument);
        $debateArgument->setVotes(new ArrayCollection([$debateArgument]));
        $debateArgument->isPublished()->willReturn(true);
        $debateArgumentVote->getId()->willReturn($debateArgumentVoteId);

        $authorizationChecker
            ->isGranted(DebateArgumentVoter::PARTICIPATE, $debateArgument)
            ->willReturn(true);

        $repository
            ->getOneByDebateArgumentAndUser($debateArgument, $viewer)
            ->willReturn($debateArgumentVote);

        $debateArgument->removeVote($debateArgumentVote)->shouldBeCalled();
        $em->remove($debateArgumentVote)->shouldBeCalled();
        $em->flush()->shouldBeCalled();

        $payload = $this->__invoke($input, $viewer);
        $payload->shouldHaveCount(3);
        $payload['errorCode']->shouldBe(null);
        $payload['debateArgument']->shouldBe($debateArgument);
        $payload['deletedDebateArgumentVoteId']->shouldBe($debateArgumentVoteId);
    }

    public function it_fails_on_invalid_id(
        GlobalIdResolver $globalIdResolver,
        Arg $input,
        User $viewer
    ) {
        $id = 'wrongId';
        $input->offsetGet('debateArgumentId')->willReturn($id);
        $globalIdResolver->resolve($id, $viewer)->willReturn(null);

        $this->__invoke($input, $viewer)->shouldBe(['errorCode' => 'UNKNOWN_DEBATE_ARGUMENT']);
    }

    public function it_fails_on_closed_debate(
        GlobalIdResolver $globalIdResolver,
        AuthorizationCheckerInterface $authorizationChecker,
        Arg $input,
        DebateArgument $debateArgument,
        User $viewer
    ) {
        $id = 'debateArgumentId';
        $input->offsetGet('debateArgumentId')->willReturn($id);
        $globalIdResolver->resolve($id, $viewer)->willReturn($debateArgument);
        $debateArgument->isPublished()->willReturn(true);

        $authorizationChecker
            ->isGranted(DebateArgumentVoter::PARTICIPATE, $debateArgument)
            ->willReturn(false);

        $this->__invoke($input, $viewer)->shouldBe(['errorCode' => 'CLOSED_DEBATE']);
    }

    public function it_fails_if_not_voted(
        GlobalIdResolver $globalIdResolver,
        DebateArgumentVoteRepository $repository,
        AuthorizationCheckerInterface $authorizationChecker,
        Arg $input,
        DebateArgument $debateArgument,
        User $viewer
    ) {
        $id = 'debateArgumentId';
        $input->offsetGet('debateArgumentId')->willReturn($id);
        $globalIdResolver->resolve($id, $viewer)->willReturn($debateArgument);
        $debateArgument->isPublished()->willReturn(true);

        $authorizationChecker
            ->isGranted(DebateArgumentVoter::PARTICIPATE, $debateArgument)
            ->willReturn(true);

        $repository->getOneByDebateArgumentAndUser($debateArgument, $viewer)->willReturn(null);

        $this->__invoke($input, $viewer)->shouldBe(['errorCode' => 'NOT_VOTED']);
    }
}
