<?php

namespace Capco\AppBundle\GraphQL\Resolver\Proposal;

use Capco\AppBundle\Entity\Proposal;
use Capco\AppBundle\Repository\PostRepository;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;

class ProposalPostsCountResolver implements QueryInterface
{
    private $postRepository;

    public function __construct(PostRepository $postRepository)
    {
        $this->postRepository = $postRepository;
    }

    public function __invoke(Proposal $proposal): int
    {
        return $this->postRepository->countPublishedPostsByProposal($proposal);
    }
}
