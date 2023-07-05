<?php

namespace Capco\AppBundle\GraphQL\Resolver\Query;

use Capco\AppBundle\Entity\Project;
use Capco\AppBundle\Enum\ProjectVisibilityMode;
use Capco\AppBundle\GraphQL\Resolver\Project\ProjectContributionResolver;
use Capco\AppBundle\Repository\ProjectRepository;
use Overblog\GraphQLBundle\Definition\Argument;
use Overblog\GraphQLBundle\Definition\Resolver\ResolverInterface;

class QueryContributionsResolver implements ResolverInterface
{
    protected $projectRepository;
    protected $projectContributionResolver;

    public function __construct(
        ProjectRepository $projectRepository,
        ProjectContributionResolver $projectContributionResolver
    ) {
        $this->projectRepository = $projectRepository;
        $this->projectContributionResolver = $projectContributionResolver;
    }

    public function __invoke(Argument $args): int
    {
        return array_sum(
            array_map(function (Project $project) {
                if (
                    ProjectVisibilityMode::VISIBILITY_PUBLIC === $project->getVisibility()
                    && !$project->getIsExternal()
                ) {
                    return $this->projectContributionResolver->__invoke($project)->getTotalCount();
                }

                return 0;
            }, $this->projectRepository->findAll())
        );
    }
}
