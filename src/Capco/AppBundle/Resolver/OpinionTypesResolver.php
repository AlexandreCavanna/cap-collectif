<?php

namespace Capco\AppBundle\Resolver;

use Capco\AppBundle\Entity\Steps\ConsultationStep;
use Capco\AppBundle\Entity\Steps\ConsultationStepType;
use Capco\AppBundle\Entity\OpinionType;
use Capco\AppBundle\Repository\OpinionRepository;
use Capco\AppBundle\Repository\OpinionTypeRepository;
use Symfony\Component\Routing\Router;

class OpinionTypesResolver
{
    private $opinionTypeRepo;
    private $opinionRepo;
    private $router;

    public function __construct(OpinionTypeRepository $opinionTypeRepo, OpinionRepository $opinionRepo, Router $router)
    {
        $this->opinionTypeRepo = $opinionTypeRepo;
        $this->opinionRepo = $opinionRepo;
        $this->router = $router;
    }

    public function getGroupedOpinionsForStep(ConsultationStep $step, $limit = 5, $page = 1)
    {
        $roots = $step->getConsultationStepType()->getRootOpinionTypes();

        $build = function ($tree) use (&$build, &$step, &$limit, &$page) {
            $childrenTree = [];
            foreach ($tree as $type) {
                $node = $this->opinionTypeRepo->getAsArrayById($type->getId());
                $node['opinions'] = $this->opinionRepo
                    ->getByOpinionTypeAndConsultationStepOrdered($step, $type->getId(), $limit, $page, $type->getDefaultFilter())
                ;
                $node['total_opinions_count'] = count($node['opinions']);
                if ($type->getChildren()->count() > 0) {
                    $node['__children'] = $build($type->getChildren());
                }
                $childrenTree[] = $node;
            }

            return $childrenTree;
        };

        return $build($roots);
    }

    public function getAllForConsultationStepType(ConsultationStepType $ct)
    {
        if ($ct === null) {
            return [];
        }

        return $ct->getOpinionTypes();
    }

    public function consultationStepTypeAllowType(ConsultationStepType $consultationStepType, OpinionType $opinionType)
    {
        if ($consultationStepType === null) {
            return [];
        }

        $allowed = false;
        $opinionTypes = $this->getAllForConsultationStepType($consultationStepType);
        foreach ($opinionTypes as $ot) {
            if ($ot->getId() === $opinionType->getId()) {
                $allowed = true;
                break;
            }
        }

        return $allowed;
    }

    public function stepAllowType(ConsultationStep $step, OpinionType $type)
    {
        if (!$step->getConsultationStepType()) {
            return false;
        }

        return $this->consultationStepTypeAllowType($step->getConsultationStepType(), $type);
    }

    public function getAvailableLinkTypesForConsultationStepType(ConsultationStepType $consultationStepType)
    {
        return $this
            ->opinionTypeRepo
            ->getLinkableOpinionTypesForConsultationStepType($consultationStepType)
        ;
    }
}
