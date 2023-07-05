<?php

namespace Capco\AppBundle\GraphQL\Resolver\Requirement;

use Capco\AppBundle\Entity\Requirement;
use Capco\AppBundle\GraphQL\Resolver\Traits\ResolverTrait;
use Capco\AppBundle\Repository\UserRequirementRepository;
use Overblog\GraphQLBundle\Definition\Resolver\ResolverInterface;

class RequirementViewerValueResolver implements ResolverInterface
{
    use ResolverTrait;

    private UserRequirementRepository $userRequirementsRepo;

    public function __construct(UserRequirementRepository $userRequirementsRepo)
    {
        $this->userRequirementsRepo = $userRequirementsRepo;
    }

    /**
     * Returns a string, a GoogleMapsAddress or a bool.
     *
     * @param mixed $viewer
     */
    public function __invoke(Requirement $requirement, $viewer)
    {
        $viewer = $this->preventNullableViewer($viewer);

        if (Requirement::FIRSTNAME === $requirement->getType()) {
            return $viewer->getFirstname();
        }
        if (Requirement::LASTNAME === $requirement->getType()) {
            return $viewer->getLastname();
        }
        if (Requirement::PHONE === $requirement->getType()) {
            return $viewer->getPhone();
        }
        if (Requirement::DATE_OF_BIRTH === $requirement->getType()) {
            return $viewer->getDateOfBirth();
        }
        if (Requirement::POSTAL_ADDRESS === $requirement->getType()) {
            return $viewer->getPostalAddress();
        }
        if (Requirement::IDENTIFICATION_CODE === $requirement->getType()) {
            return $viewer->getUserIdentificationCodeValue();
        }
        if (Requirement::PHONE_VERIFIED === $requirement->getType()) {
            return $viewer->isPhoneConfirmed();
        }
        if (Requirement::FRANCE_CONNECT === $requirement->getType()) {
            return $viewer->getFranceConnectId();
        }

        if (Requirement::CHECKBOX === $requirement->getType()) {
            $found = $this->userRequirementsRepo->findOneBy([
                'requirement' => $requirement,
                'user' => $viewer,
            ]);

            return $found ? $found->getValue() : false;
        }

        return false;
    }
}
