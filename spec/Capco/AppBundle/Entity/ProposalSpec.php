<?php

namespace spec\Capco\AppBundle\Entity;

use Capco\AppBundle\Entity\Interfaces\DisplayableInBOInterface;
use Capco\AppBundle\Entity\Interfaces\Trashable;
use Capco\AppBundle\Entity\Project;
use Capco\AppBundle\Entity\Proposal;
use Capco\AppBundle\Entity\ProposalAnalysis;
use Capco\AppBundle\Entity\ProposalAnalyst;
use Capco\AppBundle\Entity\ProposalAssessment;
use Capco\AppBundle\Entity\ProposalDecision;
use Capco\AppBundle\Entity\ProposalForm;
use Capco\AppBundle\Entity\Selection;
use Capco\AppBundle\Entity\Steps\CollectStep;
use Capco\AppBundle\Entity\Steps\ProjectAbstractStep;
use Capco\AppBundle\Entity\Steps\SelectionStep;
use Capco\AppBundle\Enum\ProposalStatementState;
use Capco\AppBundle\Model\Publishable;
use Capco\UserBundle\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use PhpSpec\ObjectBehavior;

class ProposalSpec extends ObjectBehavior
{
    public function it_is_initializable()
    {
        $this->shouldHaveType(Proposal::class);
    }

    public function it_is_a_publishable()
    {
        $this->shouldImplement(Publishable::class);
    }

    public function it_is_a_trashable()
    {
        $this->shouldImplement(Trashable::class);
    }

    public function it_is_displayable_in_bo()
    {
        $this->shouldImplement(DisplayableInBOInterface::class);
    }

    public function it_can_be_seen_in_BO_only_by_owner_admin_super_admin_and_organization(
        User $viewer,
        Project $project,
        CollectStep $step,
        ProposalForm $proposalForm,
        User $author
    ): void {
        $step->getProject()->willReturn($project);
        $step->isPrivate()->willReturn(false);
        $proposalForm->getStep()->willReturn($step);
        $author->getOrganizationId()->willReturn('1');
        $viewer->getOrganizationId()->willReturn('2');
        $this->setProposalForm($proposalForm);
        $this->setAuthor($author);

        $viewer->isAdmin()->willReturn(false);
        $this->viewerCanSeeInBo($viewer)->shouldReturn(false);

        $viewer->isAdmin()->willReturn(true);
        $this->viewerCanSeeInBo($viewer)->shouldReturn(true);

        $viewer->isAdmin()->willReturn(false);
        $project->getOwner()->willReturn($viewer);
        $this->viewerCanSeeInBo($viewer)->shouldReturn(true);

        $viewer->isAdmin()->willReturn(false);
        $author->getOrganizationId()->willReturn('1');
        $viewer->getOrganizationId()->willReturn('1');
        $this->viewerCanSeeInBo($viewer)->shouldReturn(true);
    }

    public function it_can_be_seen_by_admin_or_super_admin(User $viewer): void
    {
        $viewer->isAdmin()->willReturn(true);
        $this->viewerCanSee($viewer)->shouldReturn(true);
    }

    public function it_can_be_seen_by_organization_members(
        User $viewer,
        Project $project,
        CollectStep $step,
        ProposalForm $proposalForm,
        User $author
    ): void {
        $step->getProject()->willReturn($project);
        $step->isPrivate()->willReturn(true);
        $proposalForm->getStep()->willReturn($step);
        $this->setProposalForm($proposalForm);
        $this->setAuthor($author);

        $viewer->isAdmin()->willReturn(false);
        $viewer->getOrganizationId()->willReturn('1');
        $author->getOrganizationId()->willReturn('1');
        $this->viewerCanSee($viewer)->shouldReturn(true);
    }

    public function it_can_be_seen_by_author_if_not_published(
        User $viewer,
        Project $project,
        ProposalForm $proposalForm,
        CollectStep $collectStep
    ): void {
        $collectStep->isPrivate()->willReturn(true);
        $collectStep->getProject()->willReturn($project);
        $project->getOwner()->willReturn(null);
        $proposalForm->getStep()->willReturn($collectStep);
        $viewer->getOrganizationId()->willReturn('1');
        $viewer->isAdmin()->willReturn(false);
        $this->setProposalForm($proposalForm);
        $this->setProposalDecisionMaker(null);
        $this->setSupervisor(null);
        $this->isPublished()->shouldReturn(false);
        $this->setAuthor($viewer);
        $this->viewerCanSee($viewer)->shouldReturn(true);
    }

    public function it_can_not_be_seen_by_anonymous_if_step_is_private(
        User $author,
        ProposalForm $proposalForm,
        CollectStep $collectStep
    ): void {
        $collectStep->isPrivate()->willReturn(true);
        $proposalForm->getStep()->willReturn($collectStep);
        $this->setProposalForm($proposalForm);
        $this->setProposalDecisionMaker(null);
        $this->setSupervisor(null);
        $this->setAuthor($author);
        $this->viewerCanSee(null)->shouldReturn(false);
    }

    public function it_can_be_seen_by_author_if_step_is_private(
        User $author,
        Project $project,
        ProposalForm $proposalForm,
        CollectStep $collectStep
    ): void {
        $author->getOrganizationId()->willReturn('1');
        $author->isAdmin()->willReturn(false);
        $collectStep->isPrivate()->willReturn(true);
        $collectStep->getProject()->willReturn($project);
        $project->getOwner()->willReturn(null);
        $proposalForm->getStep()->willReturn($collectStep);
        $this->setProposalForm($proposalForm);
        $this->setProposalDecisionMaker(null);
        $this->setSupervisor(null);
        $this->setAuthor($author);
        $this->viewerCanSee($author)->shouldReturn(true);
    }

    public function it_can_be_seen_by_analyst_if_step_is_private(
        User $analyst,
        Project $project,
        ProposalAnalyst $proposalAnalyst,
        ProposalForm $proposalForm,
        CollectStep $collectStep
    ): void {
        $analyst->isAdmin()->willReturn(false);
        $collectStep->isPrivate()->willReturn(true);
        $collectStep->getProject()->willReturn($project);
        $project->getOwner()->willReturn(null);
        $proposalForm->getStep()->willReturn($collectStep);
        $this->setProposalForm($proposalForm);
        $this->setProposalDecisionMaker(null);
        $this->setSupervisor(null);

        $proposalAnalyst->setProposal($this);
        $proposalAnalyst->setAnalyst($analyst);
        $proposalAnalyst->getProposal()->willReturn($this);
        $proposalAnalyst->getAnalyst()->willReturn($analyst);
        $this->addProposalAnalyst($proposalAnalyst);
        $this->getProposalAnalystsArray()->shouldReturn([$proposalAnalyst]);

        $this->viewerCanSee($analyst)->shouldReturn(true);
    }

    public function it_can_be_seen_by_project_owner_if_step_is_private(
        User $owner,
        Project $project,
        ProposalForm $proposalForm,
        CollectStep $collectStep
    ): void {
        $owner->isAdmin()->willReturn(false);
        $collectStep->isPrivate()->willReturn(true);
        $collectStep->getProject()->willReturn($project);
        $project->getOwner()->willReturn($owner);
        $proposalForm->getStep()->willReturn($collectStep);
        $this->setProposalForm($proposalForm);
        $this->setProposalDecisionMaker(null);
        $this->setSupervisor(null);

        $this->viewerCanSee($owner)->shouldReturn(true);
    }

    public function it_can_be_seen_by_admin_if_step_is_private(
        User $author,
        ProposalForm $proposalForm,
        CollectStep $collectStep
    ): void {
        $author->isAdmin()->willReturn(true);
        $collectStep->isPrivate()->willReturn(true);
        $proposalForm->getStep()->willReturn($collectStep);
        $this->setProposalForm($proposalForm);
        $this->setProposalDecisionMaker(null);
        $this->setSupervisor(null);
        $this->setAuthor($author);
        $this->viewerCanSee($author)->shouldReturn(true);
    }

    public function it_should_know_if_viewer_is_admin_or_owner(
        User $someoneElse,
        User $owner,
        User $admin,
        ProposalForm $form,
        CollectStep $step,
        Project $project
    ): void {
        $project->getOwner()->willReturn($owner);
        $step->getProject()->willReturn($project);
        $form->getStep()->willReturn($step);
        $this->setProposalForm($form);

        $someoneElse
            ->isAdmin()
            ->shouldBeCalled()
            ->willReturn(false)
        ;
        $owner
            ->isAdmin()
            ->shouldBeCalled()
            ->willReturn(false)
        ;
        $admin
            ->isAdmin()
            ->shouldBeCalled()
            ->willReturn(true)
        ;

        $this->viewerIsAdminOrOwner(null)->shouldReturn(false);
        $this->viewerIsAdminOrOwner($someoneElse)->shouldReturn(false);
        $this->viewerIsAdminOrOwner($owner)->shouldReturn(true);
        $this->viewerIsAdminOrOwner($admin)->shouldReturn(true);
    }

    public function it_should_know_who_can_update(
        User $someoneElse,
        User $author,
        User $owner,
        User $admin,
        ProposalForm $form,
        CollectStep $step,
        Project $project
    ): void {
        $project->getOwner()->willReturn($owner);
        $step->getProject()->willReturn($project);
        $form->getStep()->willReturn($step);
        $this->setProposalForm($form);
        $this->setAuthor($author);

        $someoneElse
            ->isAdmin()
            ->shouldBeCalled()
            ->willReturn(false)
        ;
        $author->isAdmin()->willReturn(false);
        $owner
            ->isAdmin()
            ->shouldBeCalled()
            ->willReturn(false)
        ;
        $admin
            ->isAdmin()
            ->shouldBeCalled()
            ->willReturn(true)
        ;

        $this->viewerCanUpdate(null)->shouldReturn(false);
        $this->viewerCanUpdate($someoneElse)->shouldReturn(false);
        $this->viewerCanUpdate($author)->shouldReturn(true);
        $this->viewerCanUpdate($owner)->shouldReturn(true);
        $this->viewerCanUpdate($admin)->shouldReturn(true);
    }

    public function it_should_return_todo_progress_status()
    {
        $this->setDecision(null)
            ->setAssessment(null)
            ->setAnalyses([])
        ;
        $this->getGlobalProgressStatus()->shouldReturn(ProposalStatementState::TODO);
    }

    public function it_should_return_favourable_progress_status(ProposalDecision $decision)
    {
        $decision->getState()->willReturn(ProposalStatementState::FAVOURABLE);
        $this->setDecision($decision);
        $this->getGlobalProgressStatus()->shouldReturn(ProposalStatementState::FAVOURABLE);
    }

    public function it_should_return_unfavourable_progress_status(
        ProposalAssessment $proposalAssessment
    ) {
        $proposalAssessment->getState()->willReturn(ProposalStatementState::UNFAVOURABLE);
        $this->setAssessment($proposalAssessment);
        $this->getGlobalProgressStatus()->shouldReturn(ProposalStatementState::IN_PROGRESS);
    }

    public function it_should_return_in_progress_progress_status(
        ProposalAnalysis $proposalAnalysis1,
        ProposalAnalysis $proposalAnalysis2,
        ProposalAnalysis $proposalAnalysis3
    ) {
        $proposalAnalysis1->getState()->willReturn(ProposalStatementState::TODO);
        $proposalAnalysis2->getState()->willReturn(ProposalStatementState::IN_PROGRESS);
        $proposalAnalysis3->getState()->willReturn(ProposalStatementState::IN_PROGRESS);

        $this->setAnalyses([$proposalAnalysis1, $proposalAnalysis2, $proposalAnalysis3]);
        $this->getGlobalProgressStatus()->shouldReturn(ProposalStatementState::IN_PROGRESS);
    }

    public function it_should_return_analysis_favourable_progress_status(
        ProposalAnalysis $proposalAnalysis1,
        ProposalAnalysis $proposalAnalysis2,
        ProposalAnalysis $proposalAnalysis3,
        ProposalAnalysis $proposalAnalysis4
    ) {
        $proposalAnalysis1->getState()->willReturn(ProposalStatementState::TODO);
        $proposalAnalysis2->getState()->willReturn(ProposalStatementState::IN_PROGRESS);
        $proposalAnalysis3->getState()->willReturn(ProposalStatementState::IN_PROGRESS);
        $proposalAnalysis4->getState()->willReturn(ProposalStatementState::FAVOURABLE);

        $this->setAnalyses([
            $proposalAnalysis1,
            $proposalAnalysis2,
            $proposalAnalysis3,
            $proposalAnalysis4,
        ]);

        $this->getGlobalProgressStatus()->shouldReturn(ProposalStatementState::IN_PROGRESS);
    }

    public function it_is_allowed_author_to_add_news_in_collect_step(
        Project $project,
        ProposalForm $proposalForm,
        ProjectAbstractStep $projectAbstractStep,
        CollectStep $collectStep
    ) {
        $collectStep->isAllowAuthorsToAddNews()->willReturn(true);
        $collectStep->getProject()->willReturn($project);
        $collectStep->isOpen()->willReturn(true);
        $proposalForm->getStep()->willReturn($collectStep);

        $this->setProposalForm($proposalForm);
        $projectAbstractStep->getStep()->willReturn($collectStep);
        $this->setProposalForm($proposalForm);

        $project->addStep($projectAbstractStep)->willReturn($project);
        $pasList = new ArrayCollection([$projectAbstractStep->getWrappedObject()]);

        $project->getSteps()->willReturn($pasList);
        $this->getProject()->shouldReturn($project);
        $this->getSelectionSteps()->shouldReturn([]);
        $this->isProposalAuthorAllowedToAddNews()->shouldReturn(true);

        $collectStep->isAllowAuthorsToAddNews()->willReturn(false);
        $this->isProposalAuthorAllowedToAddNews()->shouldReturn(false);
    }

    public function it_is_allowed_author_to_add_news_in_selection_step(
        Project $project,
        ProposalForm $proposalForm,
        ProjectAbstractStep $projectAbstractStep,
        ProjectAbstractStep $pasSelection1,
        ProjectAbstractStep $pasSelection2,
        CollectStep $collectStep,
        SelectionStep $selectionStep,
        Selection $selection,
        Selection $selection2,
        SelectionStep $selectionStep2
    ) {
        $project->addStep($projectAbstractStep);
        $project->addStep($pasSelection1);
        $collectStep->isAllowAuthorsToAddNews()->willReturn(true);
        $collectStep->getProject()->willReturn($project);
        $collectStep->isOpen()->willReturn(false);
        $proposalForm->getStep()->willReturn($collectStep);

        $this->setProposalForm($proposalForm);
        $projectAbstractStep->getStep()->willReturn($collectStep);
        $this->setProposalForm($proposalForm);

        $project->addStep($projectAbstractStep)->willReturn($project);
        $project->addStep($pasSelection1)->willReturn($project);
        $project->addStep($pasSelection2)->willReturn($project);
        $pasList = new ArrayCollection([
            $projectAbstractStep->getWrappedObject(),
            $pasSelection1->getWrappedObject(),
            $pasSelection2->getWrappedObject(),
        ]);

        $project->getSteps()->willReturn($pasList);
        $this->getProject()->shouldReturn($project);

        $selectionStep->isAllowAuthorsToAddNews()->willReturn(true);
        $selectionStep->isOpen()->willReturn(true);
        $pasSelection1->getStep()->willReturn($selectionStep);
        $pasSelection2->getStep()->willReturn($selectionStep2);
        $selectionStep2->isAllowAuthorsToAddNews()->willReturn(false);
        $selectionStep2->isOpen()->willReturn(true);

        $selection->setProposal($this)->willReturn($selection);
        $selection->getProposal()->willReturn($this);
        $selection->getSelectionStep()->willReturn($selectionStep);

        $this->addSelection($selection);
        $this->getSelectionSteps()->shouldReturn([$selectionStep]);
        $this->isProposalAuthorAllowedToAddNews()->shouldReturn(true);

        $this->removeSelection($selection);
        $this->isProposalAuthorAllowedToAddNews()->shouldReturn(false);

        $selection2->getSelectionStep()->willReturn($selectionStep2);
        $selection2->setProposal($this)->willReturn($selection2);
        $selection2->getProposal()->willReturn($this);

        $this->addSelection($selection2);
        $this->isProposalAuthorAllowedToAddNews()->shouldReturn(false);

        $selectionStep2->isAllowAuthorsToAddNews()->willReturn(true);
        $this->isProposalAuthorAllowedToAddNews()->shouldReturn(true);

        $selectionStep2->isOpen()->willReturn(false);
        $this->isProposalAuthorAllowedToAddNews()->shouldReturn(false);

        $this->addSelection($selection);
        $this->isProposalAuthorAllowedToAddNews()->shouldReturn(true);
    }

    public function it_should_correctly_return_the_summary_or_body_based_on_form(ProposalForm $form)
    {
        $form->getUsingDescription()->willReturn(false);
        $form->getUsingSummary()->willReturn(false);

        $this->setBody('Je suis le body');
        $this->setSummary('Je suis le résumé');

        $this->setProposalForm($form);

        $this->getProposalSummaryOrBodyExcerpt()->shouldBe(null);

        $form->getUsingDescription()->willReturn(true);
        $form->getUsingSummary()->willReturn(false);

        $this->getProposalSummaryOrBodyExcerpt()->shouldBe('Je suis le body');

        $form->getUsingDescription()->willReturn(true);
        $form->getUsingSummary()->willReturn(true);

        $this->getProposalSummaryOrBodyExcerpt()->shouldBe('Je suis le résumé');

        $form->getUsingDescription()->willReturn(false);
        $form->getUsingSummary()->willReturn(true);

        $this->getProposalSummaryOrBodyExcerpt()->shouldBe('Je suis le résumé');

        $form->getUsingDescription()->willReturn(false);
        $form->getUsingSummary()->willReturn(false);

        $this->getProposalSummaryOrBodyExcerpt()->shouldBe(null);
    }
}
