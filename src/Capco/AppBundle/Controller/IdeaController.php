<?php

namespace Capco\AppBundle\Controller;

use Capco\AppBundle\Entity\Idea;
use Capco\AppBundle\Entity\IdeaVote;
use Capco\AppBundle\Entity\Theme;
use Capco\AppBundle\Form\IdeaType;
use Capco\AppBundle\Form\IdeaUpdateType;
use Capco\AppBundle\Form\IdeaVoteType;
use Capco\AppBundle\Form\IdeaSearchType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class IdeaController extends Controller
{
    /**
     * @Route("/ideas/new", name="app_idea_create")
     * @Template()
     * @param $request
     * @return array
     */
    public function createAction(Request $request)
    {
        if (!$this->get('security.context')->isGranted('ROLE_USER')) {
            throw new AccessDeniedException($this->get('translator')->trans('Access restricted to authenticated users'));
        }

        $idea = new Idea;

        if ($this->getUser()) {
            $idea->setAuthor($this->getUser());
        }

        $form = $this->createForm(new IdeaType(), $idea);

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {

                $em = $this->getDoctrine()->getManager();
                $em->persist($idea);
                $em->flush();
                $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans('Your idea has been saved'));
                return $this->redirect($this->generateUrl('app_idea_show', array('slug' => $idea->getSlug())));
            }

        }

        return array('form' => $form->createView());
    }

    /**
     * @Route("/ideas/{slug}/delete", name="app_idea_delete")
     * @Template()
     * @param $request
     * @param $idea
     * @return array
     */
    public function deleteAction(Idea $idea, Request $request)
    {

        if (!$this->get('security.context')->isGranted('ROLE_USER')) {
            throw new AccessDeniedException($this->get('translator')->trans('Access restricted to authenticated users'));
        }

        $userCurrent = $this->getUser()->getId();
        $userPostIdea = $idea->getAuthor()->getId();

        if ($userCurrent !== $userPostIdea) {
            throw new AccessDeniedException($this->get('translator')->trans('You cannot delete this contribution'));
        }

        //Champ CSRF
        $form = $this->createFormBuilder()->getForm();

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {

                //vérifie donc que le CSRF
                $em = $this->getDoctrine()->getManager();
                $em->remove($idea);
                $em->flush();
                $this->get('session')->getFlashBag()->add('info', $this->get('translator')->trans('The idea has been deleted'));

                return $this->redirect($this->generateUrl('app_idea', array()));
            }
        }

        return array(
            'idea' => $idea,
            'form' => $form->createView()
        );
    }

    /**
     * @Route("/ideas/trashed/{page}", name="app_idea_trashed", requirements={"page" = "\d+"}, defaults={"page" = 1} )
     * @Template("CapcoAppBundle:Idea:show_trashed.html.twig")
     * @param $page
     * @return array
     */
    public function showTrashedAction($page)
    {
        $em = $this->getDoctrine()->getManager();

        $pagination = $this->get('capco.site_parameter.resolver')->getValue('ideas.pagination');
        if (!is_numeric($pagination)){
            $pagination = 0;
        } else {
            $pagination = (int)$pagination;
        }

        $ideas = $em->getRepository('CapcoAppBundle:Idea')->getTrashedIdeas($pagination, $page);
        $publishedIdeasNb = $em->getRepository('CapcoAppBundle:Idea')->getPublishedIdeasNb();

        //Avoid division by 0 in nbPage calculation
        $nbPage = 1;
        if($pagination != 0){
            $nbPage = ceil(count($ideas) / $pagination);
        }

        return array(
            'ideas' => $ideas,
            'publishedIdeasNb' => $publishedIdeasNb,
            'page' => $page,
            'nbPage' => $nbPage,
        );
    }

    /**
     * @Route("/ideas/{page}", name="app_idea", requirements={"page" = "\d+"}, defaults={"page" = 1} )
     * @Route("/ideas/{theme}/{sort}/{page}", name="app_idea_search", requirements={"page" = "\d+"}, defaults={"page" = 1, "theme" = "all"} )
     * @Route("/ideas/{theme}/{sort}/{term}/{page}", name="app_idea_search_term", requirements={"page" = "\d+"}, defaults={"page" = 1, "theme" = "all"} )
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
        $currentUrl = $this->generateUrl('app_idea');

        $form = $this->createForm(new IdeaSearchType(), null, array(
            'action' => $currentUrl,
            'method' => 'POST'
        ));

        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                // redirect to the results page (avoids reload alerts)
                $data = $form->getData();

                return $this->redirect($this->generateUrl('app_idea_search_term', array(
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

        $pagination = $this->get('capco.site_parameter.resolver')->getValue('ideas.pagination');
        if (!is_numeric($pagination)){
            $pagination = 0;
        } else {
            $pagination = (int)$pagination;
        }

        $ideas = $em->getRepository('CapcoAppBundle:Idea')->getSearchResultsWithUser($pagination, $page, $theme, $sort, $term);
        $trashedIdeasNb = $em->getRepository('CapcoAppBundle:Idea')->getTrashedIdeasNb();

        //Avoid division by 0 in nbPage calculation
        $nbPage = 1;
        if($pagination != 0){
            $nbPage = ceil(count($ideas) / $pagination);
        }
        
        return array(
            'ideas' => $ideas,
            'form' => $form->createView(),
            'page' => $page,
            'nbPage' => $nbPage,
            'trashedIdeasNb' => $trashedIdeasNb,
        );
    }

    /**
     * @Cache(expires="+1 minutes", maxage="60", smaxage="60", public="true")
     * @param $max
     * @param $offset
     * @return array
     * @Template()
     */
    public function lastIdeasAction($max = 4, $offset = 0)
    {
        $ideas = $this->getDoctrine()->getRepository('CapcoAppBundle:Idea')->getLast($max, $offset);

        if (!isset($ideas[0])) {
            return new Response('');
        }

        return [ 'ideas' => $ideas ];
    }

    /**
     * @Route("/idea/{slug}", name="app_idea_show")
     * @Template()
     * @param Idea $idea
     * @param Request $request
     * @return array
     */
    public function showAction(Request $request, Idea $idea)
    {
        $em = $this->getDoctrine()->getManager();
        $currentUrl = $this->generateUrl('app_idea_show', [ 'slug' => $idea->getSlug() ]);
        $translator = $this->get('translator');
        $idea = $em->getRepository('CapcoAppBundle:Idea')->getOneIdeaWithUserAndTheme($idea);
        $reportingIdea = $this->getDoctrine()->getRepository('CapcoAppBundle:Reporting')->findBy(array(
            'Reporter' => $this->getUser(),
            'Idea' => $idea
        ));

        $userReportingIdea = (count($reportingIdea) > 0) ? true : false;

        if ($this->get('security.context')->isGranted('ROLE_USER')) {
            $userVoteCount = $em->getRepository('CapcoAppBundle:IdeaVote')->countForUserAndIdea($this->getUser(), $idea);
        } else {
            $userVoteCount = 0;
        }

        $form = $this->createForm(new IdeaVoteType(), $idea, array(
            'action' => $currentUrl,
            'method' => 'POST'
        ));

        if ($request->getMethod() == 'POST') {
            if (!$this->get('security.context')->isGranted('ROLE_USER')) {
                throw new AccessDeniedException($translator->trans('Please log in or create an account to vote for this idea!'));
            }

            $form->handleRequest($request);

            if ($form->isValid()) {
                if ($userVoteCount == 0) {
                    $vote = new IdeaVote();
                    $vote->setVoter($this->getUser());
                    $idea->addIdeaVote($vote);
                    $em->persist($idea);
                    $em->flush();

                    $this->get('session')->getFlashBag()->add('success', $translator->trans('Your vote has been saved.'));
                } else {
                    $ideaVote = $em->getRepository('CapcoAppBundle:IdeaVote')->hasVote($this->getUser(), $idea);
                    $em = $this->getDoctrine()->getManager();
                    $idea->removeIdeaVote($ideaVote);
                    $em->remove($ideaVote);
                    $em->flush();

                    $this->get('session')->getFlashBag()->add('success', $translator->trans('Your vote has been removed'));
                }

                // redirect (avoids reload alerts)
                return $this->redirect($currentUrl);
            }
        }

        return array(
            'idea' => $idea,
            'userReportingIdea' => $userReportingIdea,
            'userVoteCount' => $userVoteCount,
            'form' => $form->createView()
        );
    }

    /**
     * @Route("/idea/edit/{slug}", name="app_idea_update")
     * @Template()
     * @param $request
     * @param $idea
     * @return array
     */
    public function updateAction(Idea $idea,  Request $request)
    {
        if (!$this->get('security.context')->isGranted('ROLE_USER')) {
            throw new AccessDeniedException($this->get('translator')->trans('Access restricted to authenticated users'));
        }

        $userCurrent = $this->getUser()->getId();
        $userPostIdea = $idea->getAuthor()->getId();

        if ($userCurrent !== $userPostIdea) {
            throw new AccessDeniedException($this->get('translator')->trans('You cannot edit this idea, as you are not its author'));
        }

        $form = $this->createForm(new IdeaUpdateType(), $idea);
        if ($request->getMethod() == 'POST') {
            $form->handleRequest($request);

            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $linkedVotes = $this->getDoctrine()->getRepository("CapcoAppBundle:IdeaVote")->findBy(array('Idea'=>$idea));
                foreach($linkedVotes as $vote){
                    $em->remove($vote);
                }
                $idea->resetIdeaVotes();
                $em->persist($idea);
                $em->flush();

                $this->get('session')->getFlashBag()->add('success', $this->get('translator')->trans('The idea has been edited'));

                return $this->redirect($this->generateUrl('app_idea_show', array('slug' => $idea->getSlug())));
            }
        }

        return array(
            'form' => $form->createView(),
            'idea' => $idea
        );
    }
}
