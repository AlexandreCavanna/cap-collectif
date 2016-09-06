<?php

namespace Capco\AppBundle\Entity;

use Capco\AppBundle\Entity\Responses\AbstractResponse;
use Capco\AppBundle\Model\CommentableInterface;
use Capco\AppBundle\Traits\AnswerableTrait;
use Capco\AppBundle\Traits\CommentableTrait;
use Capco\AppBundle\Traits\EnableTrait;
use Capco\AppBundle\Traits\SluggableTitleTrait;
use Capco\AppBundle\Traits\TimestampableTrait;
use Capco\AppBundle\Traits\TrashableTrait;
use Capco\AppBundle\Traits\VotableOkTrait;
use Capco\MediaBundle\Entity\Media;
use Doctrine\Common\Collections\Collection;
use Capco\UserBundle\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\SoftDeleteable\Traits\SoftDeleteableEntity;
use Symfony\Component\Validator\Constraints as Assert;
use Capco\AppBundle\Validator\Constraints as CapcoAssert;
use Capco\AppBundle\Model\Contribution;
use Capco\AppBundle\Traits\ExpirableTrait;
use Capco\AppBundle\Traits\IdTrait;

/**
 * @ORM\Table(name="proposal")
 * @ORM\Entity(repositoryClass="Capco\AppBundle\Repository\ProposalRepository")
 * @ORM\HasLifecycleCallbacks()
 * @Gedmo\SoftDeleteable(fieldName="deletedAt")
 * @CapcoAssert\HasResponsesToRequiredQuestions(message="proposal.missing_required_responses", formField="proposalForm")
 * @CapcoAssert\HasDistrictIfMandatory()
 * @CapcoAssert\HasThemeIfMandatory()
 * @CapcoAssert\HasCategoryIfMandatory()
 * @CapcoAssert\HasOnlyOneSelectionPerStep()
 */
class Proposal implements Contribution, CommentableInterface
{
    use IdTrait;
    use CommentableTrait;
    use TimestampableTrait;
    use EnableTrait;
    use TrashableTrait;
    use SluggableTitleTrait;
    use SoftDeleteableEntity;
    use AnswerableTrait;
    use ExpirableTrait;

    public static $ratings = [1, 2, 3, 4, 5];

    /**
     * @ORM\Column(name="body", type="text")
     * @Assert\NotBlank()
     */
    private $body;

    /**
     * @Gedmo\Timestampable(on="change", field={"title", "body"})
     * @ORM\Column(name="updated_at", type="datetime")
     */
    protected $updatedAt;

    /**
     * @ORM\Column(name="rating", type="integer", nullable=true)
     */
    private $rating;

    /**
     * @ORM\Column(name="annotation", type="text", nullable=true)
     */
    private $annotation;

    /**
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\Theme", inversedBy="proposals", cascade={"persist"})
     * @ORM\JoinColumn(name="theme_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     */
    private $theme = null;

    /**
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\District", inversedBy="proposals", cascade={"persist"})
     * @ORM\JoinColumn(name="district_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     */
    private $district = null;

    /**
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\Status", cascade={"persist"}, inversedBy="proposals")
     * @ORM\JoinColumn(name="status_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     */
    private $status = null;

    /**
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\ProposalCategory", cascade={"persist"}, inversedBy="proposals")
     * @ORM\JoinColumn(name="category_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     */
    private $category = null;

    /**
     * @Assert\NotNull()
     * @ORM\ManyToOne(targetEntity="Capco\UserBundle\Entity\User", inversedBy="proposals")
     * @ORM\JoinColumn(name="author_id", referencedColumnName="id", onDelete="CASCADE", nullable=false)
     */
    protected $author;

    /**
     * @Assert\NotNull()
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\ProposalForm", inversedBy="proposals")
     * @ORM\JoinColumn(name="proposal_form_id", referencedColumnName="id", onDelete="CASCADE", nullable=false)
     */
    protected $proposalForm;

    /**
     * @ORM\OneToMany(targetEntity="Capco\AppBundle\Entity\ProposalComment", mappedBy="proposal", cascade={"persist", "remove"})
     */
    private $comments;

    /**
     * @ORM\OneToMany(targetEntity="Capco\AppBundle\Entity\Responses\AbstractResponse", mappedBy="proposal", cascade={"persist", "remove"})
     */
    private $responses;

    /**
     * @ORM\OneToMany(targetEntity="Capco\AppBundle\Entity\Reporting", mappedBy="proposal", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    protected $reports;

    /**
     * @ORM\OneToMany(targetEntity="Capco\AppBundle\Entity\Selection", mappedBy="proposal", cascade={"persist"}, orphanRemoval=true)
     */
    private $selections;

    /**
     * @ORM\Column(name="estimation", type="float", nullable=true)
     */
    private $estimation = null;

    /**
     * @ORM\ManyToMany(targetEntity="Capco\UserBundle\Entity\User", cascade={"persist"})
     * @ORM\JoinTable(name="user_favorite_proposal")
     */
    protected $likers;

    /**
     * @ORM\OneToMany(targetEntity="Capco\AppBundle\Entity\ProgressStep", mappedBy="proposal", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    private $progressSteps;

    /**
     * @ORM\OneToOne(targetEntity="Capco\MediaBundle\Entity\Media", fetch="LAZY", cascade={"persist", "remove"})
     * @ORM\JoinColumn(name="media_id", referencedColumnName="id", nullable=true, onDelete="SET NULL")
     * @Assert\Valid()
     */
    private $media;

    /**
     * @ORM\OneToMany(targetEntity="Capco\AppBundle\Entity\ProposalSelectionVote", mappedBy="proposal", cascade={"persist"})
     */
    private $selectionVotes;

    /**
     * @ORM\OneToMany(targetEntity="Capco\AppBundle\Entity\ProposalCollectVote", mappedBy="proposal", cascade={"persist"})
     */
    private $collectVotes;

    public function __construct()
    {
        $this->selectionVotes = new ArrayCollection();
        $this->collectVotes = new ArrayCollection();
        $this->reports = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->responses = new ArrayCollection();
        $this->commentsCount = 0;
        $this->updatedAt = new \Datetime();
        $this->selections = new ArrayCollection();
        $this->likers = new ArrayCollection();
        $this->progressSteps = new ArrayCollection();
    }

    public function isIndexable(): bool
    {
        return $this->enabled && !$this->expired;
    }

    public function __toString()
    {
        return $this->getId() ? $this->getTitle() : 'New proposal';
    }

    public function getBody(): string
    {
        return $this->body ?? '';
    }

    public function setBody(string $body): self
    {
        $this->body = $body;

        return $this;
    }

    public function getRating()
    {
        return $this->rating;
    }

    public function setRating(int $rating = null)
    {
        $this->rating = $rating;

        return $this;
    }

    public function getAnnotation()
    {
        return $this->annotation;
    }

    public function setAnnotation(string $annotation = null): self
    {
        $this->annotation = $annotation;

        return $this;
    }

    public function getStatus()
    {
        return $this->status;
    }

    public function setStatus(Status $status = null): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCategory()
    {
        return $this->category;
    }

    public function setCategory(ProposalCategory $category = null): self
    {
        $this->category = $category;

        return $this;
    }

    public function getTheme()
    {
        return $this->theme;
    }

    public function setTheme(Theme $theme = null): self
    {
        $this->theme = $theme;
        if ($theme) {
            $theme->addProposal($this);
        }

        return $this;
    }

    public function getDistrict()
    {
        return $this->district;
    }

    public function setDistrict(District $district = null): self
    {
        $this->district = $district;
        if ($district) {
          $district->addProposal($this);
        }

        return $this;
    }

    public function getAuthor()
    {
        return $this->author;
    }

    public function setAuthor(User $author) : self
    {
        $this->author = $author;

        return $this;
    }

    public function getProposalForm()
    {
        return $this->proposalForm;
    }

    public function setProposalForm(ProposalForm $proposalForm) : self
    {
        $this->proposalForm = $proposalForm;

        return $this;
    }

    public function getStep()
    {
        return $this->proposalForm ? $this->proposalForm->getStep() : null;
    }

    public function addResponse(AbstractResponse $response) : self
    {
        if (!$this->responses->contains($response)) {
            $this->responses[] = $response;
            $response->setProposal($this);
        }

        return $this;
    }

    public function removeResponse(AbstractResponse $response): self
    {
        $this->responses->removeElement($response);

        return $this;
    }

    public function getResponses(): Collection
    {
        return $this->responses;
    }

    public function setResponses(Collection $responses) : self
    {
        $this->responses = $responses;
        foreach ($responses as $response) {
            $response->setProposal($this);
        }

        return $this;
    }

    public function getReports(): Collection
    {
        return $this->reports;
    }

    public function addReport(Reporting $report): self
    {
        if (!$this->reports->contains($report)) {
            $this->reports->add($report);
        }

        return $this;
    }

    public function removeReport(Reporting $report): self
    {
        $this->reports->removeElement($report);

        return $this;
    }

    public function addSelection(Selection $selection): self
    {
        if (!$this->selections->contains($selection)) {
            $this->selections[] = $selection;
            $selection->setProposal($this);
        }

        return $this;
    }

    public function removeSelection(Selection $selection): self
    {
        $this->selections->removeElement($selection);

        return $this;
    }

    public function getSelections(): Collection
    {
        return $this->selections;
    }

    public function getClassName(): string
    {
        return 'Proposal';
    }

    public function canDisplay(): bool
    {
        return $this->enabled && !$this->isTrashed && $this->getStep()->canDisplay();
    }

    public function isPrivate() : bool
    {
        return $this->getProposalForm() ? $this->getProposalForm()->getStep()->isPrivate() : false;
    }

    public function isSelected() : bool
    {
        return !$this->getSelections()->isEmpty();
    }

    public function isVisible() : bool
    {
        return !$this->isPrivate() || $this->isSelected();
    }

    /**
     * @return bool
     */
    public function canContribute(): bool
    {
        return $this->enabled && !$this->isTrashed && $this->getStep()->canContribute();
    }

    public function canComment(): bool
    {
        return $this->enabled && !$this->isTrashed && $this->getIsCommentable();
    }

    public function userHasReport(User $user): bool
    {
        foreach ($this->reports as $report) {
            if ($report->getReporter() == $user) {
                return true;
            }
        }

        return false;
    }

    public function getEstimation()
    {
        return $this->estimation;
    }

    public function setEstimation(float $estimation = null): self
    {
        $this->estimation = $estimation;

        return $this;
    }

    public function getLikers(): Collection
    {
        return $this->likers;
    }

    public function addLiker(User $liker): self
    {
        if (!$this->likers->contains($liker)) {
            $this->likers[] = $liker;
        }

        return $this;
    }

    public function removeLiker(User $liker): self
    {
        $this->likers->removeElement($liker);

        return $this;
    }

    public function isPublished(): bool
    {
        return $this->enabled && !$this->isTrashed;
    }

    public function getSelectionSteps(): array
    {
        $steps = [];
        foreach ($this->selections as $selection) {
            $steps[] = $selection->getSelectionStep();
        }

        return $steps;
    }

    public function getProjectId()
    {
        if ($this->getProposalForm() && $this->getProposalForm()->getStep() && $this->getProposalForm()->getStep()->getProject()) {
            return $this->getProposalForm()->getStep()->getProjectId();
        }

        return;
    }

    public function getSelectionStepsIds(): array
    {
        $ids = array_filter(array_map(function ($value) {
            return $value->getSelectionStep() ? $value->getSelectionStep()->getId() : null;
        }, $this->getSelections()->getValues()),
            function ($value) {
                return $value !== null;
            });

        return $ids;
    }

    public function getProgressSteps() : Collection
    {
        return $this->progressSteps;
    }

    public function setProgressSteps(Collection $progressSteps) : self
    {
        $this->progressSteps = $progressSteps;

        return $this;
    }

    public function resetVotes(): self
    {
        foreach ($this->selectionVotes as $vote) {
            $this->removeVote($vote);
        }
        foreach ($this->collectVotes as $vote) {
            $this->removeVote($vote);
        }
        return $this;
    }

    public function userHasVote(User $user = null): bool
    {
        if ($user != null) {
            foreach ($this->selectionVotes as $vote) {
                if ($vote->getUser() == $user) {
                    return true;
                }
            }
            foreach ($this->collectVotes as $vote) {
                if ($vote->getUser() == $user) {
                    return true;
                }
            }
        }

        return false;
    }

    public function getSelectionVotes(): Collection
    {
        return $this->selectionVotes;
    }

    public function setSelectionVotes(Collection $votes)
    {
        $this->selectionVotes = $votes;

        return $this;
    }

    public function getCollectVotes(): Collection
    {
        return $this->collectVotes;
    }

    public function setCollectVotes(Collection $collectVotes): self
    {
        $this->collectVotes = $collectVotes;

        return $this;
    }

    public function addSelectionVote(ProposalSelectionVote $selectionVote): self
    {
        if (!$this->selectionVotes->contains($selectionVote)) {
            $this->selectionVotes->add($selectionVote);
        }

        return $this;
    }

    public function removeSelectionVote(ProposalSelectionVote $vote): self
    {
        if ($this->selectionVotes->contains($vote)) {
            $this->selectionVotes->removeElement($vote);
        }

        return $this;
    }

    public function addCollectVote(ProposalCollectVote $vote): self
    {
        if (!$this->collectVotes->contains($vote)) {
            $this->collectVotes->add($vote);
        }

        return $this;
    }

    public function addProgressStep(ProgressStep $progressStep): self
    {
        if (!$this->progressSteps->contains($progressStep)) {
            $this->progressSteps->add($progressStep);
            $progressStep->setProposal($this);
        }
        return $this;
    }

    public function removeCollectVote(ProposalCollectVote $vote): self
    {
        if ($this->collectVotes->contains($vote)) {
            $this->collectVotes->removeElement($vote);
        }
        return $this;
    }

    public function removeProgressStep(ProgressStep $progressStep): self
    {
        if ($this->progressSteps->contains($progressStep)) {
            $this->progressSteps->removeElement($progressStep);
        }
        return $this;
    }

    public function canHaveProgessSteps(): bool
    {
        return $this->getProposalForm()->getStep()->getProject()->getSteps()->exists(function ($key, $step) {
            return $step->getStep()->isSelectionStep() && $step->getStep()->isAllowingProgressSteps();
        });
    }

    /**
     * @return Media
     */
    public function getMedia()
    {
        return $this->media;
    }

    /**
     * @param mixed $media
     */
    public function setMedia(Media $media = null)
    {
        $this->media = $media;
    }
}
