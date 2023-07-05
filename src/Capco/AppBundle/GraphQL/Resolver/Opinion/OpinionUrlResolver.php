<?php

namespace Capco\AppBundle\GraphQL\Resolver\Opinion;

use Capco\AppBundle\Entity\Opinion;
use Capco\AppBundle\Repository\ConsultationStepRepository;
use Overblog\GraphQLBundle\Definition\Resolver\ResolverInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;

class OpinionUrlResolver implements ResolverInterface
{
    private $consultationStepRepository;
    private $router;
    private $logger;

    public function __construct(
        ConsultationStepRepository $consultationStepRepository,
        RouterInterface $router,
        LoggerInterface $logger
    ) {
        $this->consultationStepRepository = $consultationStepRepository;
        $this->router = $router;
        $this->logger = $logger;
    }

    public function __invoke(Opinion $contribution): string
    {
        $step = $this->consultationStepRepository->getByOpinionId($contribution->getId());
        $project = $step ? $step->getProject() : null;
        if (
            $project
            && $project->getSlug()
            && $step->getSlug()
            && $contribution->getSlug()
            && $contribution->getOpinionType()->getSlug()
        ) {
            return $this->router->generate(
                'app_consultation_show_opinion',
                [
                    'projectSlug' => $project->getSlug(),
                    'stepSlug' => $step->getSlug(),
                    'opinionTypeSlug' => $contribution->getOpinionType()->getSlug(),
                    'opinionSlug' => $contribution->getSlug(),
                ],
                UrlGeneratorInterface::ABSOLUTE_URL
            );
        }
        $this->logger->warning(
            'Opinion ' . $contribution->getId() . ' cannot have his url generated.'
        );

        return '';
    }
}
