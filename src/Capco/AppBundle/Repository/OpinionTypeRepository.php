<?php

namespace Capco\AppBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * OpinionTypeRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class OpinionTypeRepository extends EntityRepository
{
    /**
     * Get all opnionTypes with opinions for user.
     *
     * @param $user
     *
     * @return array
     */
    public function getByUser($user)
    {
        $qb = $this->createQueryBuilder('ot')
            ->addSelect('o', 'c', 'a', 'm', 'v')
            ->leftJoin('ot.Opinions', 'o')
            ->leftJoin('o.Consultation', 'c')
            ->leftJoin('o.Author', 'a')
            ->leftJoin('a.Media', 'm')
            ->leftJoin('o.Votes', 'v')
            ->andWhere('c.isEnabled = :enabled')
            ->andWhere('o.isEnabled = :enabled')
            ->andWhere('o.Author = :author')
            ->setParameter('enabled', true)
            ->setParameter('author', $user)
            ->orderBy('ot.position', 'ASC')
            ->addOrderBy('o.createdAt', 'DESC');

        return $qb
            ->getQuery()
            ->getResult();
    }

    /**
     * Count all opinionTypes with opinions for user.
     *
     * @param $user
     *
     * @return array
     */
    public function countByUser($user)
    {
        $qb = $this->createQueryBuilder('ot')
            ->addSelect('o', 'c')
            ->Join('ot.Opinions', 'o')
            ->leftJoin('o.Consultation', 'c')
            ->addGroupBy('ot.id')
            ->andWhere('o.Author = :author')
            ->andWhere('o.isEnabled = :enabled')
            ->andWhere('c.isEnabled = :enabled')
            ->setParameter('enabled', true)
            ->setParameter('author', $user)
            ->orderBy('ot.position', 'ASC')
            ->addOrderBy('o.createdAt', 'DESC');

        return $qb
            ->getQuery()
            ->getScalarResult();
    }

    /**
     * Get all opinionTypes with opinions for consultation.
     *
     * @param $consultation
     *
     * @return array
     */
    public function getByConsultationOrderedByNbVotes($consultation)
    {
        $qb = $this->createQueryBuilder('ot')
            ->addSelect('o', 'c', 'a', 'm', 'arg', 'v', '(o.voteCountOk + o.voteCountNok + o.voteCountMitige) as HIDDEN vnb')
            ->leftJoin('ot.Opinions', 'o', 'WITH', 'o.isEnabled = :enabled AND o.Consultation = :consultation AND o.isTrashed = :notTrashed')
            ->leftJoin('o.Consultation', 'c')
            ->leftJoin('o.Author', 'a')
            ->leftJoin('a.Media', 'm')
            ->leftJoin('o.arguments', 'arg')
            ->leftJoin('o.Votes', 'v')
            ->andWhere('ot IN (:allowedTypes)')
            ->setParameter('consultation', $consultation)
            ->setParameter('enabled', true)
            ->setParameter('notTrashed', false)
            ->setParameter('allowedTypes', $consultation->getAllowedTypes())
            ->orderBy('ot.position', 'ASC')
            ->addOrderBy('vnb', 'DESC');

        return $qb
            ->getQuery()
            ->getResult();
    }

    /**
     * Get all opinionTypes.
     *
     * @return array
     */
    public function getOrderedByPosition()
    {
        $qb = $this->createQueryBuilder('ot')
            ->orderBy('ot.position', 'ASC');

        return $qb
            ->getQuery()
            ->getResult();
    }
}
