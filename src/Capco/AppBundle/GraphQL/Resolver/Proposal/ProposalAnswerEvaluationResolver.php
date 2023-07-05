<?php

namespace Capco\AppBundle\GraphQL\Resolver\Proposal;

use Capco\AppBundle\Entity\Proposal;
use Capco\AppBundle\Entity\ProposalEvaluation;
use Overblog\GraphQLBundle\Definition\Resolver\ResolverInterface;

/**
 * @deprecated this is our legacy evaluation tool
 */
class ProposalAnswerEvaluationResolver implements ResolverInterface
{
    public function __invoke(Proposal $proposal): ?ProposalEvaluation
    {
        return $proposal->getProposalEvaluation();
    }
}
