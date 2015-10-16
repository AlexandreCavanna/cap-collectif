<?php

namespace Capco\AppBundle\Controller\Api;

use Capco\AppBundle\Entity\Opinion;
use Capco\AppBundle\Entity\Consultation;
use Capco\AppBundle\Entity\ConsultationStep;
use Capco\AppBundle\Entity\OpinionType;
use Capco\AppBundle\Form\Api\OpinionType as OpinionForm;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Util\Codes;

class ConsultationStepsController extends FOSRestController
{
    /**
     * @Security("has_role('ROLE_USER')")
     * @Post("/consultations/{consultationId}/steps/{stepId}/opinions")
     * @ParamConverter("consultation", options={"mapping": {"consultationId": "id"}})
     * @ParamConverter("step", options={"mapping": {"stepId": "id"}})
     * @View(statusCode=201, serializerGroups={})
     */
    public function postOpinionAction(Request $request, Consultation $consultation, ConsultationStep $step)
    {
        if (!$step->canContribute()) {
            throw new BadRequestHttpException($this->get('translator')->trans('consultation.error.no_contribute', [], 'CapcoAppBundle'));
        }

        $user = $this->getUser();
        $opinion = (new Opinion())
            ->setAuthor($user)
            ->setStep($step)
            ->setIsEnabled(true);

        $form = $this->createForm(new OpinionForm(), $opinion);
        $form->handleRequest($request);

        $consultationType = $step->getConsultationType();
        $link = $opinion->getLink();

        $availablesOpinionTypes = $link
            ? $link->getOpinionType()->getAvailableOpinionTypesToCreateLink()
            : $this->get('capco.opinion_types.resolver')->getAllForConsultationType($consultationType)
        ;

        $opinionType = $opinion->getOpinionType();

        if (!$opinionType->getIsEnabled()) {
            throw new BadRequestHttpException('This opinionType is not enabled.');
        }

        if (!in_array($opinionType, $availablesOpinionTypes->toArray())) {
            throw new BadRequestHttpException('This opinionType is not available.');
        }

        $em = $this->get('doctrine.orm.entity_manager');

        // TODO à tester
        $mustHaveAppendixTypes = $em->getRepository('CapcoAppBundle:OpinionTypeAppendixType')
                                    ->findBy(['opinionType' => $opinionType]);
        $appendices = $opinion->getAppendices();
        foreach ($mustHaveAppendixTypes as $appendixType) {
            $found = false;
            foreach ($appendices as $appendix) {
                if ($appendix->getAppendixType() == $appendixType) {
                    $found = true;
                }
            }
            if (!$found) {
                throw new BadRequestHttpException('Unable to find AppendixType');
            }
        }
        //

        if ($form->isValid()) {

            // ce truc devrait être dans un event genre prePersit... mais au final le précédent controlleur devrait disparaître sous peu
            $currentMaximumPosition = $this->get('capco.opinion_types.resolver')
                                           ->getMaximumPositionByOpinionTypeAndStep($opinionType, $step);
            $opinion->setPosition($currentMaximumPosition + 1);
            //

            $em->persist($opinion);
            $em->flush();

            return $opinion;
        }

        return $this->view($form->getErrors(true), Codes::HTTP_BAD_REQUEST);
    }
}
