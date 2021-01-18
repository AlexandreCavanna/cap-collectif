<?php

namespace Capco\AppBundle\Entity;

use Capco\AppBundle\Elasticsearch\IndexableInterface;
use Capco\AppBundle\Entity\Steps\AbstractStep;
use Capco\AppBundle\Model\HasAuthorInterface;
use Capco\AppBundle\Model\Publishable;
use Capco\AppBundle\Model\VoteContribution;
use Capco\AppBundle\Traits\IdTrait;
use Capco\AppBundle\Traits\PublishableTrait;
use Capco\AppBundle\Traits\TimestampableTrait;
use Capco\UserBundle\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\UniqueConstraint;

/**
 * @ORM\Table(
 *   name="votes",
 *   indexes={
 *        @Index(name="collectstep_voter_idx", columns={"voter_id", "collect_step_id"}),
 *        @Index(name="selectionstep_voter_idx", columns={"voter_id", "selection_step_id"}),
 *        @Index(name="proposal_selectionstep_idx", columns={"proposal_id", "selection_step_id"}),
 *        @Index(name="proposal_collectstep_idx", columns={"proposal_id", "collect_step_id"}),
 *        @Index(name="collectstep_published_idx", columns={"collect_step_id", "published", "voteType"}),
 *        @Index(name="proposal_collectstep_published_idx", columns={"proposal_id", "collect_step_id", "published", "voteType"}),
 *   },
 *   uniqueConstraints={
 *        @UniqueConstraint(
 *            name="opinion_vote_unique",
 *            columns={"voter_id", "opinion_id"}
 *        ),
 *        @UniqueConstraint(
 *            name="argument_vote_unique",
 *            columns={"voter_id", "argument_id"}
 *        ),
 *        @UniqueConstraint(
 *            name="opinion_version_vote_unique",
 *            columns={"voter_id", "opinion_version_id"}
 *        ),
 *        @UniqueConstraint(
 *            name="selection_step_vote_unique",
 *            columns={"voter_id", "proposal_id", "selection_step_id"}
 *        ),
 *        @UniqueConstraint(
 *            name="collect_step_vote_unique",
 *            columns={"voter_id", "proposal_id", "collect_step_id"}
 *        ),
 *        @UniqueConstraint(
 *            name="source_vote_unique",
 *            columns={"voter_id", "source_id"}
 *        ),
 *        @UniqueConstraint(
 *            name="comment_vote_unique",
 *            columns={"voter_id", "comment_id"}
 *        ),
 *        @UniqueConstraint(
 *            name="debate_vote_unique",
 *            columns={"voter_id", "debate_id"}
 *        ),
 *        @UniqueConstraint(
 *            name="debate_argument_vote_unique",
 *            columns={"voter_id", "debate_argument_id"}
 *        )
 *    }
 * )
 * @ORM\Entity(repositoryClass="Capco\AppBundle\Repository\AbstractVoteRepository")
 * @ORM\HasLifecycleCallbacks()
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name = "voteType", type = "string")
 * @ORM\DiscriminatorMap({
 *      "comment"           = "CommentVote",
 *      "opinion"           = "OpinionVote",
 *      "opinionVersion"    = "OpinionVersionVote",
 *      "argument"          = "ArgumentVote",
 *      "source"            = "SourceVote",
 *      "proposalSelection" = "ProposalSelectionVote",
 *      "proposalCollect"   = "ProposalCollectVote",
 *      "debate"   = "Capco\AppBundle\Entity\Debate\DebateVote",
 *      "debateArgument"   = "Capco\AppBundle\Entity\Debate\DebateArgumentVote",
 * })
 */
abstract class AbstractVote implements
    Publishable,
    VoteContribution,
    HasAuthorInterface,
    IndexableInterface
{
    use IdTrait;
    use PublishableTrait;
    use TimestampableTrait;

    /**
     * @ORM\ManyToOne(targetEntity="Capco\UserBundle\Entity\User", inversedBy="votes")
     * @ORM\JoinColumn(name="voter_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $user;

    /**
     * @ORM\Column(name="is_accounted", type="boolean", options={"default": true})
     */
    private $isAccounted = true;

    public function getKind(): string
    {
        return 'vote';
    }

    public function getRelated()
    {
        return null;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->user;
    }

    public function hasUser(): bool
    {
        return (bool) $this->getUser();
    }

    public function isPrivate(): bool
    {
        return false;
    }

    /** ======= Useful methods for ElasticSearch ======= */
    public function isIndexable(): bool
    {
        $related = $this->getRelated();

        return null !== $related &&
            $related instanceof IndexableInterface &&
            $related->isIndexable();
    }

    public function getProject(): ?Project
    {
        return null;
    }

    public function getProposal(): ?Proposal
    {
        return null;
    }

    public function getStep(): ?AbstractStep
    {
        return null;
    }

    public function getConsultation(): ?Consultation
    {
        return null;
    }

    public function getIsAccounted(): bool
    {
        return $this->isAccounted;
    }

    public function setIsAccounted(bool $isAccounted): self
    {
        $this->isAccounted = $isAccounted;

        return $this;
    }

    public static function getElasticsearchPriority(): int
    {
        return 6;
    }

    public static function getElasticsearchTypeName(): string
    {
        return 'vote';
    }

    public static function getElasticsearchSerializationGroups(): array
    {
        return [
            'ElasticsearchVote',
            'ElasticsearchVoteNestedProject',
            'ElasticsearchVoteNestedAuthor',
            'ElasticsearchVoteNestedStep',
            'ElasticsearchVoteNestedArgument',
        ];
    }
}
