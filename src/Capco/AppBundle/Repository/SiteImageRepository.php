<?php

namespace Capco\AppBundle\Repository;

use Capco\AppBundle\Entity\SiteImage;
use Doctrine\ORM\EntityRepository;

/**
 * @method null|SiteImage findOneBy(array $criteria, array $orderBy = null)
 * @method null|SiteImage find($id, $lockMode = null, $lockVersion = null)
 */
class SiteImageRepository extends EntityRepository
{
    public function getSiteFavicon(): ?SiteImage
    {
        $qb = $this->createQueryBuilder('si');

        return $qb
            ->andWhere($qb->expr()->eq('si.keyname', ':keyname'))
            ->setParameter('keyname', 'favicon')
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function getAppLogo(): ?SiteImage
    {
        $qb = $this->createQueryBuilder('si');

        return $qb
            ->andWhere($qb->expr()->eq('si.keyname', ':keyname'))
            ->setParameter('keyname', 'image.logo')
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public static function getValuesIfEnabledCacheKey()
    {
        return 'SiteImageRepository_getValuesIfEnabled_resultcache_';
    }

    public function getValuesIfEnabled()
    {
        return $this->getEntityManager()
            ->createQueryBuilder()
            ->select('p', 'm')
            ->from($this->getClassName(), 'p', 'p.keyname')
            ->leftJoin('p.media', 'm')
            ->andWhere('p.isEnabled = 1')
            ->groupBy('p.keyname')
            ->getQuery()
            ->useQueryCache(true)
            ->enableResultCache(60, self::getValuesIfEnabledCacheKey())
            ->getResult()
        ;
    }
}
