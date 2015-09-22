<?php

namespace Capco\AppBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Capco\AppBundle\Entity\Opinion;

/**
 * OpinionVersionRepository.
 */
class OpinionVersionRepository extends EntityRepository
{
    public function getEnabledByOpinion(Opinion $opinion, $offset = 0, $limit = 10, $filter = 'last')
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->select('o', '(o.voteCountMitige + o.voteCountOk + o.voteCountNok) as HIDDEN vnb')
            ->leftJoin('o.author', 'author')
            ->leftJoin('author.Media', 'm')
            ->leftJoin('o.votes', 'v')
            ->andWhere('o.parent = :opinion')
            ->andWhere('o.isTrashed = false')
            ->setParameter('opinion', $opinion)
        ;

        if ($filter == 'last') {
            $qb->orderBy('o.updatedAt', 'DESC');
            $qb->addOrderBy('o.voteCountOk', 'DESC');
        } elseif ($filter == 'old') {
            $qb->orderBy('o.updatedAt', 'ASC');
            $qb->addOrderBy('o.voteCountOk', 'DESC');
        } elseif ($filter == 'favorable') {
            $qb->orderBy('o.voteCountOk', 'DESC');
            $qb->addOrderBy('o.voteCountNok', 'ASC');
            $qb->addOrderBy('o.updatedAt', 'DESC');
        } elseif ($filter == 'votes') {
            $qb->orderBy('vnb', 'DESC');
            $qb->addOrderBy('o.updatedAt', 'DESC');
        } elseif ($filter == 'comments') {
            $qb->orderBy('o.argumentsCount', 'DESC');
            $qb->addOrderBy('o.updatedAt', 'DESC');
        } elseif ($filter == 'positions') {
            $qb->orderBy('o.position', 'ASC');
            $qb->addOrderBy('o.updatedAt', 'DESC');
        }

        $qb
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        return new Paginator($qb);
    }

    /**
     * Get enabled opinions by consultation step.
     *
     * @param $step
     *
     * @return mixed
     */
    public function getEnabledByConsultationStep($step)
    {
        $qb = $this->getIsEnabledQueryBuilder('ov')
            ->addSelect('o', 'ot', 'aut', 'arg', 'sources', 'votes')
            ->leftJoin('ov.parent', 'o')
            ->leftJoin('ov.author', 'aut')
            ->leftJoin('ov.arguments', 'arg')
            ->leftJoin('ov.sources', 'sources')
            ->leftJoin('ov.votes', 'votes')
            ->leftJoin('o.OpinionType', 'ot')
            ->andWhere('o.step = :step')
            ->setParameter('step', $step)
            ->addOrderBy('ov.updatedAt', 'DESC');

        return $qb
            ->getQuery()
            ->getResult();
    }

    protected function getIsEnabledQueryBuilder($alias = 'o')
    {
        return $this->createQueryBuilder($alias)
                    ->andWhere($alias.'.enabled = true')
                ;
    }
}
