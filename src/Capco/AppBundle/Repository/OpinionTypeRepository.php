<?php

namespace Capco\AppBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * OpinionTypeRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class OpinionTypeRepository extends EntityRepository
{
    public function findByType($consultation)
    {
        $qb = $this->createQueryBuilder('ot')
            ->leftJoin('ot.Opinions','o')
            ->addSelect('o')
            ->leftJoin('o.Consultation', 'c')
            ->addSelect('c')
            ->leftJoin('o.Author', 'a')
            ->addSelect('a')
            ->leftJoin('o.arguments', 'arg')
            ->addSelect('arg')
            ->leftJoin('o.Votes', 'v')
            ->addSelect('v')
            ->andWhere('o.Consultation = :consultation')
            ->setParameter('consultation', $consultation)
            ->orderBy('ot.position', 'ASC')
            ->addOrderBy('o.createdAt', 'DESC');

        return $qb
            ->getQuery()
            ->getResult();
    }

}
