<?php

namespace spec\Capco\UserBundle\Controller;

use Capco\AppBundle\Entity\Comment;
use Capco\AppBundle\GraphQL\Resolver\Step\StepUrlResolver;
use Capco\AppBundle\Manager\ContributionManager;
use Capco\AppBundle\Repository\AbstractStepRepository;
use Capco\AppBundle\Repository\CommentRepository;
use Capco\UserBundle\Controller\ConfirmationController;
use Capco\UserBundle\Doctrine\UserManager;
use Capco\UserBundle\Entity\User;
use Capco\UserBundle\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use FOS\UserBundle\Security\LoginManager;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Psr\Log\LoggerInterface;
use Swarrot\SwarrotBundle\Broker\Publisher;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBagInterface;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Router;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class ConfirmationControllerSpec extends ObjectBehavior
{
    public function let(
        UserManager $userManager,
        LoginManager $loginManager,
        Router $router,
        StepUrlResolver $stepUrlResolver,
        Session $session,
        ContributionManager $contributionManager,
        TranslatorInterface $translator,
        UserRepository $userRepo,
        AbstractStepRepository $stepRepository,
        Publisher $publisher,
        CommentRepository $commentRepository,
        EntityManagerInterface $em,
        LoggerInterface $logger
    ) {
        $this->beConstructedWith(
            $userManager,
            $loginManager,
            $router,
            $stepUrlResolver,
            $session,
            $contributionManager,
            $translator,
            $userRepo,
            $stepRepository,
            $publisher,
            $commentRepository,
            $em,
            $logger
        );
        $this->login = false;
    }

    public function it_is_initializable()
    {
        $this->shouldHaveType(ConfirmationController::class);
    }

    public function it_can_not_confirm_an_email_of_unknown_token(
        UserManager $userManager,
        Session $session,
        LoginManager $loginManager,
        FlashBagInterface $flashBag,
        Router $router,
        ContributionManager $contributionManager,
        TranslatorInterface $translator
    ) {
        $router->generate('app_homepage')->willReturn('/');
        $session->getFlashBag()->willReturn($flashBag);
        $userManager
            ->findUserByConfirmationToken('unknowntoken')
            ->shouldBeCalled()
            ->willReturn(null)
        ;
        $translator
            ->trans('global.alert.already_email_confirmed', [], 'CapcoAppBundle')
            ->shouldBeCalled()
            ->willReturn('global.alert.already_email_confirmed')
        ;
        $flashBag->add('success', 'global.alert.already_email_confirmed')->shouldBeCalled();
        $this->emailAction(
            'unknowntoken',
            false,
            $userManager,
            $session,
            $loginManager,
            $router,
            $contributionManager
        );
    }

    public function it_can_confirm_an_email_of_a_valid_token(
        UserManager $userManager,
        Session $session,
        LoginManager $loginManager,
        FlashBagInterface $flashBag,
        Router $router,
        User $user,
        ContributionManager $contributionManager,
        TranslatorInterface $translator
    ) {
        $router->generate('app_homepage')->willReturn('/');
        $session->getFlashBag()->willReturn($flashBag);
        $userManager
            ->findUserByConfirmationToken('validtoken')
            ->shouldBeCalled()
            ->willReturn($user)
        ;
        $userManager
            ->updateUser($user)
            ->shouldBeCalled()
            ->willReturn(null)
        ;

        $user->setConfirmedAccountAt(\Prophecy\Argument::type(\DateTime::class))->shouldBeCalled();
        $user->isConsentInternalCommunication()->willReturn(true);
        $user->getEmail()->willReturn('test@test.com');
        $user
            ->setEnabled(true)
            ->shouldBeCalled()
            ->willReturn($user)
        ;
        $user
            ->setLastLogin(Argument::any())
            ->shouldBeCalled()
            ->willReturn($user)
        ;
        $user
            ->setConfirmationToken(null)
            ->shouldBeCalled()
            ->willReturn($user)
        ;

        $user->getPassword()->willReturn('already existing password');

        $contributionManager
            ->publishContributions($user)
            ->shouldBeCalled()
            ->willReturn(true)
        ;

        $translator
            ->trans('global.alert.email_confirmed_with_republish', [], 'CapcoAppBundle')
            ->shouldBeCalled()
            ->willReturn('global.alert.email_confirmed_with_republish')
        ;
        $flashBag->add('success', 'global.alert.email_confirmed_with_republish')->shouldBeCalled();

        $this->emailAction(
            'validtoken',
            false,
            $userManager,
            $session,
            $loginManager,
            $router,
            $contributionManager
        );
    }

    public function it_can_not_confirm_a_new_email_of_unknown_token(
        UserManager $userManager,
        Session $session,
        LoginManager $loginManager,
        FlashBagInterface $flashBag,
        Router $router,
        User $user,
        ContributionManager $contributionManager,
        UserRepository $userRepo,
        TranslatorInterface $translator
    ) {
        $router->generate('app_homepage')->willReturn('/');
        $session->getFlashBag()->willReturn($flashBag);
        $userRepo
            ->findUserByNewEmailConfirmationToken('invalidtoken')
            ->shouldBeCalled()
            ->willReturn(null)
        ;
        $translator
            ->trans('global.alert.already_email_confirmed', [], 'CapcoAppBundle')
            ->shouldBeCalled()
            ->willReturn('global.alert.already_email_confirmed')
        ;
        $flashBag->add('success', 'global.alert.already_email_confirmed')->shouldBeCalled();
        $this->newEmailAction(
            'invalidtoken',
            false,
            $userManager,
            $session,
            $loginManager,
            $router,
            $userRepo,
            $contributionManager
        );
    }

    public function it_can_confirm_a_new_email_of_a_not_confirmed_user(
        UserManager $userManager,
        Session $session,
        LoginManager $loginManager,
        FlashBagInterface $flashBag,
        Router $router,
        User $user,
        ContributionManager $contributionManager,
        UserRepository $userRepo,
        TranslatorInterface $translator
    ) {
        $router->generate('app_homepage')->willReturn('/');
        $session->getFlashBag()->willReturn($flashBag);
        $userRepo
            ->findUserByNewEmailConfirmationToken('validtoken')
            ->shouldBeCalled()
            ->willReturn($user)
        ;

        $user->getNewEmailToConfirm()->willReturn('newemail@gmail.com');
        $user
            ->setEmail('newemail@gmail.com')
            ->shouldBeCalled()
            ->willReturn($user)
        ;
        $user->setNewEmailConfirmationToken(null)->willReturn($user);
        $user->setNewEmailToConfirm(null)->willReturn($user);
        $user->isEmailConfirmed()->willReturn(false);

        $contributionManager
            ->publishContributions($user)
            ->shouldBeCalled()
            ->willReturn(true)
        ;
        $user
            ->setConfirmationToken(null)
            ->shouldBeCalled()
            ->willReturn($user)
        ;
        $user
            ->setEnabled(true)
            ->shouldBeCalled()
            ->willReturn($user)
        ;

        $user->setConfirmedAccountAt(\Prophecy\Argument::type(\DateTime::class))->shouldBeCalled();

        $userManager
            ->updateUser($user)
            ->shouldBeCalled()
            ->willReturn(null)
        ;
        $translator
            ->trans('global.alert.new_email_confirmed', [], 'CapcoAppBundle')
            ->shouldBeCalled()
            ->willReturn('global.alert.new_email_confirmed')
        ;
        $flashBag->add('success', 'global.alert.new_email_confirmed')->shouldBeCalled();

        $this->newEmailAction(
            'validtoken',
            false,
            $userManager,
            $session,
            $loginManager,
            $router,
            $userRepo,
            $contributionManager
        );
    }

    public function it_should_confirm_anon_comment_email(
        RouterInterface $router,
        SessionInterface $session,
        CommentRepository $commentRepository,
        TranslatorInterface $translator,
        Comment $comment,
        EntityManagerInterface $em,
        FlashBagInterface $flashBag
    ) {
        $token = 'token';
        $router->generate('app_homepage')->shouldBeCalledOnce()->willReturn('/');
        $session->getFlashBag()->willReturn($flashBag);
        $commentRepository->findOneBy(['confirmationToken' => $token])->willReturn($comment);
        $comment->setConfirmationToken(null)->shouldBeCalledOnce();
        $em->flush()->shouldBeCalledOnce();
        $message = 'message';
        $translator->trans(
            'comment-email-confirm-waiting-for-moderation',
            [],
            'CapcoAppBundle'
        )->shouldBeCalledOnce()->willReturn($message);
        $flashBag->add('success', $message)->shouldBeCalledOnce();

        $this->commentConfirmAnonymousEmail($token);
    }
}
