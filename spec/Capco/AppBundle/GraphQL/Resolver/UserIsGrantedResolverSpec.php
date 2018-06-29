<?php

namespace spec\Capco\AppBundle\GraphQL\Resolver;

use Capco\AppBundle\GraphQL\Resolver\UserIsGrantedResolver;
use Capco\UserBundle\Entity\User;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;
use Psr\Log\LoggerInterface;
use Symfony\Component\ExpressionLanguage\Token;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class UserIsGrantedResolverSpec extends ObjectBehavior
{
    function let(User $viewer, User $userInToken, TokenStorage $tokenStorage, LoggerInterface $logger, TokenInterface $token)
    {
        $this->beConstructedWith($tokenStorage, $logger);
    }

    function it_is_initializable()
    {
        $this->shouldHaveType(UserIsGrantedResolver::class);
    }

    function it_should_grant_if_acl_disabled()
    {
        $this->isGranted(null, null, ['disable_acl' => true])->shouldReturn(true);
    }

    function it_im_not_a_user_and_i_try_to_be_granted()
    {
        $this->isGranted('anon.')->shouldReturn(false);
    }

    function it_is_granted_as_viewer(User $viewer, User $userRequest, TokenStorage $tokenStorage, LoggerInterface $logger, TokenInterface $token)
    {
        $viewer->getRoles()->willReturn(['ROLE_USER']);
        $userRequest->getRoles()->willReturn(['ROLE_USER']);

        $viewer->hasRole('ROLE_USER')->willReturn(true);
        $viewer->hasRole('ROLE_ADMIN')->willReturn(false);

        $viewer->getId()->willReturn('1');
        $userRequest->getId()->willReturn('1');

        $tokenStorage->getToken()->willReturn($token);

        $this->beConstructedWith($tokenStorage, $logger);
        $this->isGranted($viewer, $userRequest)->shouldReturn(true);
    }

    function it_is_granted_as_admin(User $viewer, TokenStorage $tokenStorage, LoggerInterface $logger, TokenInterface $token)
    {
        $viewer->getRoles()->willReturn(['ROLE_ADMIN']);
        $viewer->hasRole('ROLE_USER')->willReturn(true);
        $viewer->hasRole('ROLE_ADMIN')->willReturn(true);
        $viewer->getId()->willReturn('1');

        $tokenStorage->getToken()->willReturn($token);

        $this->beConstructedWith($tokenStorage, $logger);
        $this->isGranted($viewer, null)->shouldReturn(true);
    }

    function it_is_not_granted_as_other_user(User $viewer, User $userRequest, TokenStorage $tokenStorage, LoggerInterface $logger, TokenInterface $token)
    {
        $viewer->hasRole('ROLE_USER')->willReturn(true);
        $viewer->getId()->willReturn('1');
        $userRequest->getId()->willReturn('3');

        $viewer->hasRole('ROLE_ADMIN')->willReturn(false);

        $tokenStorage->getToken()->willReturn($token);

        $this->beConstructedWith($tokenStorage, $logger);
        $this->isGranted($viewer, $userRequest)->shouldReturn(false);
    }

    function it_is_not_granted_as_other_user_than_user_connected(User $viewer, User $userInToken, User $userRequest, TokenStorage $tokenStorage, LoggerInterface $logger, TokenInterface $token)
    {
        $viewer->hasRole('ROLE_USER')->willReturn(true);
        $viewer->hasRole('ROLE_ADMIN')->willReturn(false);

        $userInToken->hasRole('ROLE_USER')->willReturn(true);
        $userInToken->getRoles()->willReturn(['ROLE_USER']);

        $viewer->getId()->willReturn('1');
        $userInToken->getId()->willReturn('2');
        $userRequest->getId()->willReturn('3');

        $token->getUser()->willReturn($userInToken);
        $tokenStorage->getToken()->willReturn($token);

        $this->beConstructedWith($tokenStorage, $logger);
        $this->isGranted($viewer, null)->shouldReturn(false);
    }
}
