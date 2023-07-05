<?php

namespace Capco\AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class HasResponsesToRequiredQuestions extends Constraint
{
    public $message = 'global.missing_required_responses';
    public $formField = '';

    public function validatedBy(): string
    {
        return static::class . 'Validator';
    }

    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }
}
