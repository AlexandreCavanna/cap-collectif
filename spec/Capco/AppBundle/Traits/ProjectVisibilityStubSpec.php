<?php

namespace spec\Capco\AppBundle\Traits;

use Capco\AppBundle\Enum\ProjectVisibilityMode;
use Capco\AppBundle\Traits\ProjectVisibilityStub;
use Capco\UserBundle\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use PhpSpec\ObjectBehavior;

class ProjectVisibilityStubSpec extends ObjectBehavior
{
    public function let()
    {
        $this->beConstructedWith();
        // use anonymous class ?
        $this->beAnInstanceOf(ProjectVisibilityStub::class);
    }

    public function it_is_initializable()
    {
        $this->shouldHaveType(ProjectVisibilityStub::class);
    }

    public function it_is_visible_all(User $viewer, User $author)
    {
        $this->setVisibility(ProjectVisibilityMode::VISIBILITY_PUBLIC);
        $this->getVisibility()->shouldReturn(ProjectVisibilityMode::VISIBILITY_PUBLIC);

        $viewer->getId()->willReturn('viewer');
        $viewer->hasRole('ROLE_USER')->willReturn(true);
        $viewer->hasRole('ROLE_ADMIN')->willReturn(false);
        $viewer->hasRole('ROLE_SUPER_ADMIN')->willReturn(false);
        $viewer->getRoles()->willReturn(['ROLE_USER']);

        $author->getId()->willReturn('author');
        $author->hasRole('ROLE_USER')->willReturn(true);
        $author->hasRole('ROLE_ADMIN')->willReturn(true);
        $author->hasRole('ROLE_SUPER_ADMIN')->willReturn(false);
        $author->getRoles()->willReturn(['ROLE_USER', 'ROLE_ADMIN']);

        $authors = new ArrayCollection([$author]);
        $this->setAuthors($authors);
        $this->getAuthors()->shouldReturn($authors);

        $this->getVisibilityForViewer($viewer)->shouldReturn([2]);
        $this->getVisibilityForViewer(null)->shouldReturn([2]);
    }

    public function it_is_visible_for_admin_only(User $viewer, User $author)
    {
        $this->setVisibility(ProjectVisibilityMode::VISIBILITY_ADMIN);
        $this->getVisibility()->shouldReturn(ProjectVisibilityMode::VISIBILITY_ADMIN);

        $viewer->getId()->willReturn('viewer');
        $viewer->hasRole('ROLE_USER')->willReturn(true);
        $viewer->hasRole('ROLE_ADMIN')->willReturn(false);
        $viewer->hasRole('ROLE_SUPER_ADMIN')->willReturn(false);
        $viewer->getRoles()->willReturn(['ROLE_USER']);

        $author->getId()->willReturn('author');
        $author->hasRole('ROLE_USER')->willReturn(true);
        $author->hasRole('ROLE_ADMIN')->willReturn(true);
        $author->hasRole('ROLE_SUPER_ADMIN')->willReturn(false);
        $author->getRoles()->willReturn(['ROLE_USER', 'ROLE_ADMIN']);

        $authors = new ArrayCollection([$author]);
        $this->setAuthors($authors);
        $this->getAuthors()->shouldReturn($authors);

        $this->getVisibilityForViewer($viewer)->shouldReturn([2]);
        $this->getVisibilityForViewer(null)->shouldReturn([2]);

        $viewer->hasRole('ROLE_ADMIN')->willReturn(true);
        $viewer->getRoles()->willReturn(['ROLE_USER', 'ROLE_ADMIN']);
        $this->getVisibilityForViewer($viewer)->shouldReturn([2, 0, 1]);

        $viewer->hasRole('ROLE_SUPER_ADMIN')->willReturn(true);
        $viewer->getRoles()->willReturn(['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']);
        $this->getVisibilityForViewer($viewer)->shouldReturn([2, 0, 1, 3]);
    }

    public function it_is_visible_for_me_only(User $viewer, User $author)
    {
        $this->setVisibility(ProjectVisibilityMode::VISIBILITY_ME);
        $this->getVisibility()->shouldReturn(ProjectVisibilityMode::VISIBILITY_ME);

        $viewer->getId()->willReturn('viewer');
        $viewer->hasRole('ROLE_USER')->willReturn(true);
        $viewer->hasRole('ROLE_ADMIN')->willReturn(false);
        $viewer->hasRole('ROLE_SUPER_ADMIN')->willReturn(false);
        $viewer->getRoles()->willReturn(['ROLE_USER']);

        $author->getId()->willReturn('author');
        $author->hasRole('ROLE_USER')->willReturn(true);
        $author->hasRole('ROLE_ADMIN')->willReturn(true);
        $author->hasRole('ROLE_SUPER_ADMIN')->willReturn(false);
        $author->getRoles()->willReturn(['ROLE_USER', 'ROLE_ADMIN']);

        $authors = new ArrayCollection([$author]);
        $this->setAuthors($authors);
        $this->getAuthors()->shouldReturn($authors);

        $this->getVisibilityForViewer($author)->shouldReturn([2, 0, 1]);
        $this->getVisibilityForViewer($viewer)->shouldReturn([2]);

        $viewer->hasRole('ROLE_ADMIN')->willReturn(true);
        $viewer->getRoles()->willReturn(['ROLE_USER', 'ROLE_ADMIN']);
        $this->getVisibilityForViewer($viewer)->shouldReturn([2, 0, 1]);

        $viewer->hasRole('ROLE_SUPER_ADMIN')->willReturn(true);
        $viewer->getRoles()->willReturn(['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']);
        $this->getVisibilityForViewer($viewer)->shouldReturn([2, 0, 1, 3]);

        $this->getVisibilityForViewer(null)->shouldReturn([2]);
    }
}
