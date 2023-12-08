<?php

namespace Capco\AppBundle\GraphQL\Mutation\Step;

use Capco\AppBundle\Entity\Steps\QuestionnaireStep;
use Capco\AppBundle\Service\AddStepService;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Overblog\GraphQLBundle\Definition\Argument;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;

class AddQuestionnaireStepMutation implements MutationInterface
{
    private AddStepService $addStepService;
    private EntityManagerInterface $em;

    public function __construct(AddStepService $addStepService, EntityManagerInterface $em)
    {
        $this->addStepService = $addStepService;
        $this->em = $em;
    }

    public function __invoke(Argument $input, User $viewer): array
    {
        /** * @var QuestionnaireStep $step  */
        list('step' => $step) = $this->addStepService->addStep($input, $viewer, 'QUESTIONNAIRE');
        $questionnaire = $step->getQuestionnaire();

        $organization = $viewer->getOrganization();
        $owner = $organization ?? $viewer;
        $questionnaire->setCreator($viewer);
        $questionnaire->setOwner($owner);

        $this->em->flush();

        return ['step' => $step];
    }
}
