<?php

namespace Capco\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

use Capco\AppBundle\Entity\NewsletterSubscription;
use Capco\AppBundle\Form\NewsletterSubscriptionType;

use Capco\AppBundle\Entity\Consultation;

class HomepageController extends Controller
{
    /**
     * @Route("/", name="app_homepage")
     * @Template()
     */
    public function homepageAction(Request $request)
    {
        // Subscription to newsletter
        $subscription = new NewsletterSubscription;
        $toggleManager = $this->get('capco.toggle.manager');

        $form = $this->createForm(new NewsletterSubscriptionType(), $subscription);

        $sections = $this->get('capco.section.resolver')->getDisplayableEnabledSectionsOrdered();

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($toggleManager->isActive('newsletter') && $form->isValid()) {
                $alreadyExists = $this->getDoctrine()->getRepository('CapcoAppBundle:NewsletterSubscription')->findOneByEmail($subscription->getEmail());
                if(null != $alreadyExists){
                    $this->get('session')->getFlashBag()->add('info', $this->get('translator')->trans('homepage.newsletter.already_subscribed'));
                }
                else{
                    $em = $this->getDoctrine()->getManager();
                    $em->persist($subscription);
                    $em->flush();
                    $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans('homepage.newsletter.success'));
                }
            }
            else{
                $this->get('session')->getFlashBag()->add('danger', $this->get('translator')->trans('homepage.newsletter.invalid'));
            }
            return $this->redirect($this->generateUrl('app_homepage'));

        }

        return array(
            'form' => $form->createView(),
            'sections' => $sections,
        );
    }

    /**
     * @Template("CapcoAppBundle:Homepage:videos.html.twig")
     */
    public function lastVideosAction($max = 4, $offset = 0)
    {
        $videos = $this->get('capco.video.repository')->getLast($max, $offset);

        return [ 'videos' => $videos ];
    }

    /**
     * @Cache(expires="+1 minutes", maxage="60", smaxage="60", public="true")
     * @Template("CapcoAppBundle:Homepage:lastIdeas.html.twig")
     */
    public function lastIdeasAction($max = 4, $offset = 0)
    {
        $ideas = $this->getDoctrine()->getRepository('CapcoAppBundle:Idea')->getLast($max, $offset);

        return [ 'ideas' => $ideas ];
    }

    /**
     * @Cache(expires="+1 minutes", maxage="60", smaxage="60", public="true")
     * @Template("CapcoAppBundle:Theme:lastThemes.html.twig")
     */
    public function lastThemesAction($max = 4, $offset = 0)
    {
        $topics = $this->getDoctrine()->getRepository('CapcoAppBundle:Theme')->getLast($max, $offset);

        return [ 'topics' => $topics ];
    }

    /**
     * @Cache(expires="+1 minutes", maxage="60", smaxage="60", public="true")
     * @Template("CapcoAppBundle:Blog:lastPosts.html.twig")
     */
    public function lastPostsAction($max = 3, $offset = 0)
    {
        $posts = $this->get('capco.blog.post.repository')->getLast($max, $offset);

        return [ 'posts' => $posts ];
    }

    /**
     * @Cache(expires="+1 minutes", maxage="60", smaxage="60", public="true")
     * @Template("CapcoAppBundle:Homepage:lastConsultations.html.twig")
     */
    public function lastConsultationsAction($max = 3, $offset = 0)
    {
        $consultationSteps = $this->getDoctrine()->getRepository('CapcoAppBundle:Step')->getLastOpen($max, $offset);
        $left = $max - count($consultationSteps);
        if ($left > 0) {
            $consultationSteps = array_merge($consultationSteps, $this->getDoctrine()->getRepository('CapcoAppBundle:Step')->getLastFuture($left, $offset));
        }
        $left = $max - count($consultationSteps);
        if ($left > 0) {
            $consultationSteps = array_merge($consultationSteps, $this->getDoctrine()->getRepository('CapcoAppBundle:Step')->getLastClosed($left, $offset));
        }
        return [
            'consultationSteps' => $consultationSteps,
            'statuses' => Consultation::$openingStatuses
        ];
    }

    /**
     * @Template()
     */
    public function socialNetworksAction()
    {
        $socialNetworks = $this->getDoctrine()->getRepository('CapcoAppBundle:SocialNetwork')->getEnabled();

        return [
            'socialNetworks' => $socialNetworks
        ];
    }
}
