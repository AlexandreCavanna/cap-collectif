<?php

namespace Capco\AppBundle\GraphQL\Resolver\User;

use Capco\UserBundle\Entity\User;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;

class UserRegistrationConfirmationUrlResolver implements QueryInterface
{
    private $router;

    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function __invoke(User $user): ?string
    {
        return ($token = $user->getConfirmationToken())
            ? $this->router->generate(
                'account_confirm_email',
                ['token' => $user->getConfirmationToken()],
                UrlGeneratorInterface::ABSOLUTE_URL
            )
            : null;
    }
}
