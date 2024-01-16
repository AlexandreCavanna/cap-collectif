<?php

namespace Capco\AppBundle\GraphQL\Resolver\Theme;

use Capco\AppBundle\Entity\Theme;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;

class ThemeUrlResolver implements QueryInterface
{
    private $router;

    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function __invoke(Theme $theme): string
    {
        return $this->router->generate(
            'app_theme_show',
            ['slug' => $theme->translate()->getSlug()],
            UrlGeneratorInterface::ABSOLUTE_URL
        );
    }
}
