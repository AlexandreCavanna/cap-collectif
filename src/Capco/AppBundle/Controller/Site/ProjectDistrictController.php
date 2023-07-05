<?php

namespace Capco\AppBundle\Controller\Site;

use Capco\AppBundle\Entity\District\ProjectDistrict;
use Capco\AppBundle\Repository\ProjectDistrictRepository;
use Overblog\GraphQLBundle\Relay\Node\GlobalId;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController as Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

class ProjectDistrictController extends Controller
{
    private ProjectDistrictRepository $repository;

    public function __construct(ProjectDistrictRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @Route("/project-district/{slug}", name="app_project_district_show", options={"i18n" = false})
     * @Template("CapcoAppBundle:ProjectDistrict:show.html.twig")
     */
    public function showAction(string $slug)
    {
        $district = $this->getDistrict($slug);

        return ['districtId' => GlobalId::toGlobalId('District', $district->getId())];
    }

    private function getDistrict(string $slug): ProjectDistrict
    {
        $district = $this->repository->getBySlug($slug);
        if ($district instanceof ProjectDistrict) {
            return $district;
        }

        throw new NotFoundHttpException('Could not find a district for this id.');
    }
}
