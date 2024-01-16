<?php

namespace Capco\AppBundle\GraphQL\Resolver\Sourceable;

use Capco\AppBundle\Repository\SourceCategoryRepository;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;

class SourceableAvailableCategoriesResolver implements QueryInterface
{
    protected $sourceCategoryRepository;

    public function __construct(SourceCategoryRepository $sourceCategoryRepository)
    {
        $this->sourceCategoryRepository = $sourceCategoryRepository;
    }

    public function __invoke(): array
    {
        return $this->sourceCategoryRepository->findBy(['isEnabled' => true]);
    }
}
