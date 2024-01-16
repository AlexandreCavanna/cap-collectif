<?php

namespace Capco\AppBundle\GraphQL\Resolver\QuestionChoice;

use Capco\AppBundle\Entity\Questions\AbstractQuestion;
use Capco\AppBundle\Entity\Questions\MultipleChoiceQuestion;
use Overblog\GraphQLBundle\Definition\Resolver\QueryInterface;

class QuestionChoiceIsOtherAllowedResolver implements QueryInterface
{
    public function __invoke(AbstractQuestion $question): bool
    {
        if ($question instanceof MultipleChoiceQuestion) {
            return $question->isOtherAllowed();
        }

        return false;
    }
}
