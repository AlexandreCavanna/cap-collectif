<?php

namespace Capco\AppBundle\GraphQL\Resolver\Query;

use Capco\AppBundle\Repository\ContactFormRepository;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;

class ContactFormQueryResolver implements QueryInterface
{
    private $contactFormRepository;

    public function __construct(ContactFormRepository $contactFormRepository)
    {
        $this->contactFormRepository = $contactFormRepository;
    }

    public function __invoke(): array
    {
        return $this->contactFormRepository->getAll();
    }
}
