<?php

namespace Capco\AppBundle\Traits;

use Doctrine\ORM\Mapping as ORM;

trait VoteThresholdTrait
{
    /**
     * @ORM\Column(name="vote_threshold", type="integer", nullable=true)
     */
    private $voteThreshold = 0;

    public function getVoteThreshold(): ?int
    {
        return $this->voteThreshold;
    }

    public function setVoteThreshold(?int $voteThreshold = null): self
    {
        $this->voteThreshold = $voteThreshold;

        return $this;
    }

    public function hasVoteThreshold(): bool
    {
        return $this->getVoteThreshold() && $this->getVoteThreshold() > 0;
    }
}
