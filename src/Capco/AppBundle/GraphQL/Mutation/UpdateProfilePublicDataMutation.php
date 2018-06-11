<?php

namespace Capco\AppBundle\GraphQL\Mutation;

use Capco\AppBundle\Toggle\Manager;
use Capco\UserBundle\Entity\User;
use Capco\UserBundle\Form\Type\PublicDataType;
use GraphQL\Error\UserError;
use Overblog\GraphQLBundle\Definition\Argument;

class UpdateProfilePublicDataMutation extends BaseUpdateProfile
{
    private $toggleManager;

    public function __invoke(Argument $input, User $user): array
    {
        parent::__invoke($input, $user);

        if (!$this->toggleManager->isActive('user_type')) {
            // blocking bug, need to throw an exception and catch it into JS
            unset($this->arguments['userType']);
        }

        $form = $this->formFactory->create(PublicDataType::class, $this->user, ['csrf_protection' => false]);
        try {
            $form->submit($this->arguments, false);
        } catch (\LogicException $e) {
            $this->logger->error(__METHOD__ . ' : ' . $e->getMessage());
        }

        if (!$form->isValid()) {
            $this->logger->error(__METHOD__ . ' : ' . (string) $form->getErrors(true, false));
            throw new UserError('Can\'t update !');
        }

        $this->em->flush();

        return ['user' => $user];
    }

    public function setToggleManager(Manager $toggleManager)
    {
        $this->toggleManager = $toggleManager;
    }
}
