<?php

namespace Capco\AppBundle\Repository;

use Capco\AppBundle\Entity\Steps\ProjectAbstractStep;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\EntityRepository;

/**
 * @method ProjectAbstractStep|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProjectAbstractStep|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProjectAbstractStep[]    findAll()
 * @method ProjectAbstractStep[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectAbstractStepRepository extends EntityRepository
{
    public static function createOrderedByCritera(array $orderings): Criteria
    {
        return Criteria::create()->orderBy($orderings);
    }
}