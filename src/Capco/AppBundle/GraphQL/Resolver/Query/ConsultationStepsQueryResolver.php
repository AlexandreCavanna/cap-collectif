<?php

namespace Capco\AppBundle\GraphQL\Resolver\Query;

use Capco\AppBundle\Repository\ConsultationStepRepository;
use Overblog\GraphQLBundle\Definition\Argument as Arg;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;
use Overblog\GraphQLBundle\Relay\Node\GlobalId;

class ConsultationStepsQueryResolver implements QueryInterface
{
    private $consultationStepRepository;

    public function __construct(ConsultationStepRepository $consultationStepRepository)
    {
        $this->consultationStepRepository = $consultationStepRepository;
    }

    public function __invoke(Arg $args)
    {
        if (isset($args['id'])) {
            $stepId = GlobalId::fromGlobalId($args['id'])['id'];
            $consultation = $this->consultationStepRepository->find($stepId);

            return [$consultation];
        }

        return $this->consultationStepRepository->findAll();
    }
}
