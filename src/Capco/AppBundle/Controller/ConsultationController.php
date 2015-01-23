<?php

namespace Capco\AppBundle\Controller;

use Capco\AppBundle\Entity\Argument;
use Capco\AppBundle\Entity\Consultation;
use Capco\AppBundle\Entity\Opinion;
use Capco\AppBundle\Entity\OpinionType;
use Capco\AppBundle\Entity\Theme;
use Capco\AppBundle\Entity\Step;
use Capco\AppBundle\Form\ConsultationSearchType;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class ConsultationController extends Controller
{

    /**
     * @Cache(expires="+1 minutes", maxage="60", smaxage="60", public="true")
     * @Template("CapcoAppBundle:Consultation:lastConsultations.html.twig")
     * @param $max
     * @param $offset
     * @return array
     */
    public function lastOpenConsultationsAction($max = 4, $offset = 0)
    {
        $consultations = $this->getDoctrine()->getRepository('CapcoAppBundle:Consultation')->getLastOpen($max, $offset);

        return [
            'consultations' => $consultations,
            'statuses' => Consultation::$openingStatuses
        ];
    }

    // Page consultation

    /**
     * @Route("/consultations/{slug}", name="app_consultation_show")
     * @Template()
     * @param Consultation $consultation
     * @return array
     */
    public function showAction(Consultation $consultation)
    {
        $em = $this->getDoctrine()->getManager();
        $consultation = $em->getRepository('CapcoAppBundle:Consultation')->getOne($consultation->getSlug());

        if (false == $consultation->canDisplay() ) {
            throw $this->createNotFoundException();
        }

        return [
            'consultation' => $consultation,
            'statuses' => Theme::$statuses,
        ];
    }

    /**
     * @Template("CapcoAppBundle:Consultation:show_nav.html.twig")
     * @param $consultation
     * @param $type
     * @return array
     */
    public function showNavOpinionTypesAction(Consultation $consultation, $type)
    {
        $opinionTypes = $this->getDoctrine()->getRepository('CapcoAppBundle:OpinionType')->getOrderedByPosition();

        return [
            'opinionTypes' => $opinionTypes,
            'opinionTypeCurrent' => $type,
            'consultation' => $consultation,
        ];
    }

    /**
     * @Template("CapcoAppBundle:Consultation:show_opinions.html.twig")
     * @param $consultation
     * @return array
     */
    public function showOpinionsAction(Consultation $consultation)
    {
        $blocks = $this->getDoctrine()->getRepository('CapcoAppBundle:OpinionType')->getByConsultation($consultation);

        return [
            'blocks' => $blocks,
            'consultation' => $consultation,
        ];
    }

    /**
     * @Route("/consultations/{consultationSlug}/opinions/{opinionTypeSlug}/{page}", name="app_consultation_show_opinions", requirements={"page" = "\d+"}, defaults={"page" = 1})
     * @ParamConverter("consultation", class="CapcoAppBundle:Consultation", options={"mapping": {"consultationSlug": "slug"}})
     * @ParamConverter("opinionType", class="CapcoAppBundle:OpinionType", options={"mapping": {"opinionTypeSlug": "slug"}})
     * @Template("CapcoAppBundle:Consultation:show_by_type.html.twig")
     * @param Consultation $consultation
     * @param OpinionType $opinionType
     * @param $page
     * @return array
     */
    public function showByTypeAction(Consultation $consultation, OpinionType $opinionType, $page)
    {
        if (false == $consultation->canDisplay() ) {
            throw $this->createNotFoundException();
        }

        $currentUrl = $this->generateUrl('app_consultation_show_opinions', ['consultationSlug' => $consultation->getSlug(), 'opinionTypeSlug' => $opinionType->getSlug() ]);
        $opinions = $this->getDoctrine()->getRepository('CapcoAppBundle:Opinion')->getByOpinionTypeAndConsultation($consultation, $opinionType, 10, $page);

        return [
            'currentUrl' => $currentUrl,
            'consultation' => $consultation,
            'opinionType' => $opinionType,
            'opinions' => $opinions,
            'page' => $page,
            'nbPage' => ceil(count($opinions) / 10),
        ];
    }

    /**
     * @Route("/consultations/{consultationSlug}/trashed", name="app_consultation_show_trashed")
     * @ParamConverter("consultation", class="CapcoAppBundle:Consultation", options={"mapping": {"consultationSlug": "slug"}})
     * @Template("CapcoAppBundle:Consultation:show_trashed.html.twig")
     * @param Consultation $consultation
     * @return array
     */
    public function showTrashedAction(Consultation $consultation)
    {
        if (false == $consultation->canDisplay() ) {
            throw $this->createNotFoundException();
        }

        $opinions = $this->getDoctrine()->getRepository('CapcoAppBundle:Opinion')->getTrashedByConsultation($consultation);
        $arguments = $this->getDoctrine()->getRepository('CapcoAppBundle:Argument')->getTrashedByConsultation($consultation);
        $sources = $this->getDoctrine()->getRepository('CapcoAppBundle:Source')->getTrashedByConsultation($consultation);

        return [
            'consultation' => $consultation,
            'opinions' => $opinions,
            'arguments' => $arguments,
            'sources' => $sources,
            'argumentsLabels' => Argument::$argumentTypesLabels,
        ];
    }

    /**
     * @Route("/consultations/{page}", name="app_consultation", requirements={"page" = "\d+"}, defaults={"page" = 1} )
     * @Route("/consultations/{theme}/{sort}/{page}", name="app_consultation_search", requirements={"page" = "\d+"}, defaults={"page" = 1, "theme" = "all"} )
     * @Route("/consultations/{theme}/{sort}/{term}/{page}", name="app_consultation_search_term", requirements={"page" = "\d+"}, defaults={"page" = 1, "theme" = "all"} )
     * @Template()
     * @param $page
     * @param $request
     * @param $theme
     * @param $sort
     * @param $term
     * @return array
     */
    public function indexAction(Request $request, $page, $theme = null, $sort = null, $term = null)
    {
        $em = $this->getDoctrine()->getManager();
        $currentUrl = $this->generateUrl('app_consultation');

        $form = $this->createForm(new ConsultationSearchType(), null, array(
            'action' => $currentUrl,
            'method' => 'POST'
        ));

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                // redirect to the results page (avoids reload alerts)
                $data = $form->getData();

                return $this->redirect($this->generateUrl('app_consultation_search_term', array(
                    'theme' => $data['theme'] ? $data['theme']->getSlug() : Theme::FILTER_ALL,
                    'sort' => $data['sort'],
                    'term' => $data['term']
                )));
            }
        } else {
            $form->setData(array(
                'theme' => $em->getRepository('CapcoAppBundle:Theme')->findOneBySlug($theme),
                'sort' => $sort,
                'term' => $term,
            ));
        }

        $pagination = $this->get('capco.site_parameter.resolver')->getValue('consultations.pagination');
        if (!is_numeric($pagination)){
            $pagination = 0;
        } else {
            $pagination = (int)$pagination;
        }

        $consultations = $em->getRepository('CapcoAppBundle:Consultation')->getSearchResults($pagination, $page, $theme, $sort, $term);

        //Avoid division by 0 in nbPage calculation
        $nbPage = 1;
        if($pagination != 0){
            $nbPage = ceil(count($consultations) / $pagination);
        }

        return [
            'consultations' => $consultations,
            'statuses' => Consultation::$openingStatuses,
            'page' => $page,
            'nbPage' => $nbPage,
            'form' => $form->createView()
        ];
    }

}
