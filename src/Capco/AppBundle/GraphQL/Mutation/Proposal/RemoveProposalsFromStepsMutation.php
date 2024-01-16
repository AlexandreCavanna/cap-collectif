<?php

namespace Capco\AppBundle\GraphQL\Mutation\Proposal;

use Capco\AppBundle\GraphQL\Resolver\Traits\MutationTrait;
use Capco\UserBundle\Entity\User;
use GraphQL\Error\UserError;
use Overblog\GraphQLBundle\Definition\Argument;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;

class RemoveProposalsFromStepsMutation extends AbstractProposalStepMutation implements MutationInterface
{
    use MutationTrait;

    public function __invoke(Argument $args, User $user): array
    {
        $this->formatInput($args);
        $error = null;
        $proposals = [];
        $steps = [];
        $this->project = null;

        try {
            $proposals = $this->getProposals($args->offsetGet('proposalIds'), $user);
            $steps = $this->getSteps($args->offsetGet('stepIds'), $user);
            $this->removeSelections($steps, $proposals);
        } catch (UserError $userError) {
            $error = $userError->getMessage();
        }

        return [
            'proposals' => $this->getConnection($proposals, $args),
            'error' => $error,
            'steps' => $steps,
        ];
    }

    private function removeSelections(array $steps, array $proposals): void
    {
        $changedProposals = [];
        foreach ($proposals as $proposal) {
            $hasChanged = false;
            foreach ($steps as $step) {
                $selection = $this->getSelection($proposal, $step);
                if ($selection) {
                    $this->entityManager->remove($selection);
                    $hasChanged = true;
                }
            }

            if ($hasChanged) {
                $changedProposals[] = $proposal;
            }
        }
        $this->entityManager->flush();
        $this->publish($changedProposals);
    }
}
