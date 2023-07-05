<?php

namespace Capco\AppBundle\Repository;

use Capco\AppBundle\Entity\Steps\CollectStep;
use Capco\AppBundle\Entity\Theme;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * ThemeRepository.
 */
class ThemeRepository extends EntityRepository
{
    public function getLast(int $limit = 1, int $offset = 0): Paginator
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('c')
            ->leftJoin('t.projects', 'c')
            ->addOrderBy('t.position', 'ASC')
            ->addOrderBy('t.updatedAt', 'DESC')
        ;
        $query = $qb->getQuery();

        if ($limit) {
            $query->setMaxResults($limit);
        }

        if ($offset) {
            $query->setFirstResult($offset);
        }

        return new Paginator($query);
    }

    public function findWithTitle(?string $term = null): array
    {
        $qb = $this->getIsEnabledQueryBuilder();
        $qb->leftJoin('t.translations', 'translation')
            ->andWhere('translation.title LIKE :term')
            ->setParameter('term', '%' . $term . '%')
        ;

        return $qb->getQuery()->getResult();
    }

    public function findOneWithTitle(?string $term = null): ?Theme
    {
        $qb = $this->getIsEnabledQueryBuilder();
        $qb->leftJoin('t.translations', 'translation')
            ->andWhere('translation.title = :term')
            ->setParameter('term', $term)
        ;

        return $qb->getQuery()->getOneOrNullResult();
    }

    public function getSearchResultsWithCounters(
        int $nbByPage = 8,
        int $page = 1,
        ?string $term = null
    ): Paginator {
        if ($page < 1) {
            throw new \InvalidArgumentException(sprintf('The argument "page" cannot be lower than 1 (current value: "%s")', $page));
        }

        $qb = $this->getIsEnabledQueryBuilder();
        $qb->addOrderBy('t.position', 'ASC');
        $qb->addOrderBy('t.position', 'ASC')->addOrderBy('t.updatedAt', 'DESC');
        if (null !== $term) {
            $qb->leftJoin('t.translations', 'translation');
            $qb->andWhere('translation.title LIKE :term')->setParameter('term', '%' . $term . '%');
        }

        $query = $qb->getQuery();

        if ($nbByPage > 0) {
            $query->setFirstResult(($page - 1) * $nbByPage)->setMaxResults($nbByPage);
        }

        return new Paginator($query);
    }

    public function getOneBySlug(string $slug): ?Theme
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->leftJoin('t.posts', 'post', 'WITH', 'post.isPublished = :enabled')
            ->leftJoin('t.translations', 'translation')
            ->leftJoin('t.events', 'e', 'WITH', 'e.enabled = :enabled')
            ->andWhere('translation.slug = :slug')
            ->setParameter('enabled', true)
            ->setParameter('slug', $slug)
            ->orderBy('t.updatedAt', 'DESC')
        ;

        return $qb->getQuery()->getOneOrNullResult();
    }

    public function getThemesWithProposalsCountForStep(
        CollectStep $step,
        ?string $locale = 'fr-FR',
        $limit = null
    ) {
        $qb = $this->getIsEnabledQueryBuilder()
            ->leftJoin('t.translations', 'translation')
            ->select('translation.title as name')
            ->andWhere('translation.locale = :locale')
            ->addSelect(
                '(
                SELECT COUNT(p.id) as pCount
                FROM CapcoAppBundle:Proposal p
                LEFT JOIN p.proposalForm pf
                LEFT JOIN p.theme pt
                WHERE pf.step = :step
                AND pt.id = t.id
                AND p.draft = false
                AND p.published = true
                AND p.trashedStatus IS NULL
                AND p.deletedAt IS NULL
            ) as value'
            )
            ->setParameter('step', $step)
            ->setParameter('locale', $locale)
            ->orderBy('value', 'DESC')
        ;
        if ($limit) {
            $qb->setMaxResults($limit);
        }

        return $qb->getQuery()->getArrayResult();
    }

    public function countAll(?string $locale = 'fr-FR'): int
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->leftJoin('t.translations', 'translation')
            ->andWhere('translation.locale = :locale')
            ->setParameter('locale', $locale)
            ->select('COUNT(t.id)')
        ;

        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    protected function getIsEnabledQueryBuilder()
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.isEnabled = :enabled')
            ->setParameter('enabled', true)
        ;
    }
}
