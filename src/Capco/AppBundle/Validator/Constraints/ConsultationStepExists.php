<?php

namespace Capco\AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class ConsultationStepExists extends Constraint
{
    public $message = 'synthesis.consultation_step.is_not_set';

    public function validatedBy()
    {
        return static::class . 'Validator';
    }

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}
