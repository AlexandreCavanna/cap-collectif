<?php

namespace Capco\AppBundle\GraphQL\Resolver\Event;

use Capco\AppBundle\Entity\Event;
use Capco\AppBundle\Resolver\UrlResolver;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;
use Symfony\Component\Routing\RouterInterface;

class EventUrlResolver implements QueryInterface
{
    private $urlResolver;
    private $router;

    public function __construct(UrlResolver $urlResolver, RouterInterface $router)
    {
        $this->urlResolver = $urlResolver;
        $this->router = $router;
    }

    public function __invoke(Event $event, bool $isAdminUrl = false): string
    {
        if ($isAdminUrl) {
            return $this->router->generate(
                'admin_capco_app_event_edit',
                ['id' => $event->getId()],
                RouterInterface::ABSOLUTE_URL
            );
        }

        return $this->urlResolver->getObjectUrl($event, true);
    }
}
