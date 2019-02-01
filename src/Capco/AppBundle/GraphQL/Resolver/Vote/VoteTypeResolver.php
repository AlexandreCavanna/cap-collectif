<?php

namespace Capco\AppBundle\GraphQL\Resolver\Vote;

use Capco\AppBundle\Entity\SourceVote;
use Capco\AppBundle\Entity\CommentVote;
use Capco\AppBundle\Entity\OpinionVote;
use Capco\AppBundle\Entity\AbstractVote;
use Capco\AppBundle\Entity\ArgumentVote;
use Capco\AppBundle\Entity\OpinionVersionVote;
use Capco\AppBundle\Entity\ProposalCollectVote;
use Capco\AppBundle\Entity\ProposalSelectionVote;
use GraphQL\Error\UserError;
use Overblog\GraphQLBundle\Resolver\TypeResolver;
use Overblog\GraphQLBundle\Definition\Resolver\ResolverInterface;
use GraphQL\Type\Definition\Type;

class VoteTypeResolver implements ResolverInterface
{
    private $typeResolver;

    public function __construct(TypeResolver $typeResolver)
    {
        $this->typeResolver = $typeResolver;
    }

    public function __invoke(AbstractVote $node): Type
    {
        if ($node instanceof OpinionVote) {
            return $this->typeResolver->resolve('OpinionVote');
        }
        if ($node instanceof ProposalCollectVote) {
            return $this->typeResolver->resolve('ProposalVote');
        }
        if ($node instanceof ProposalSelectionVote) {
            return $this->typeResolver->resolve('ProposalVote');
        }
        if ($node instanceof OpinionVersionVote) {
            return $this->typeResolver->resolve('VersionVote');
        }
        if ($node instanceof ArgumentVote) {
            return $this->typeResolver->resolve('ArgumentVote');
        }
        if ($node instanceof SourceVote) {
            return $this->typeResolver->resolve('SourceVote');
        }
        if ($node instanceof CommentVote) {
            return $this->typeResolver->resolve('CommentVote');
        }

        throw new UserError('Could not resolve type of Vote.');
    }
}
