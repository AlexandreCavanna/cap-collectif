<?php

namespace Capco\AppBundle\Repository;

use Capco\AppBundle\Entity\ProposalSupervisor;
use Doctrine\ORM\EntityRepository;

/**
 * @method findBySupervisor(\Capco\UserBundle\Entity\User $user, array $array, int $limit, int $offset)
 * @method findBySupervisorAndProposal(\Capco\UserBundle\Entity\User $user, \Capco\AppBundle\Entity\Proposal $proposal)
 * @method findByProposal(\Capco\AppBundle\Entity\Proposal $proposal)
 */
class ProposalSupervisorRepository extends EntityRepository
{
    public function findByProposalIds(array $proposalIds = []): array
    {
        return $this->createQueryBuilder('ps')
            ->andWhere('ps.proposal IN (:proposals)')
            ->setParameter('proposals', $proposalIds)
            ->getQuery()
            ->getResult()
        ;
    }

    public function deleteByProposalIds(array $proposalIds)
    {
        return $this->createQueryBuilder('ps')
            ->delete(ProposalSupervisor::class, 'proposalSupervisor')
            ->andWhere('proposalSupervisor.proposal IN (:proposals)')
            ->setParameter('proposals', $proposalIds)
            ->getQuery()
            ->getResult()
        ;
    }
}
