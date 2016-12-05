<?php

namespace Capco\AppBundle\Repository;

use Capco\AppBundle\Entity\Project;
use Capco\AppBundle\Entity\Theme;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * ProjectRepository.
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class ProjectRepository extends EntityRepository
{
    /**
     * Get one by slug.
     *
     * @param $slug
     *
     * @return mixed
     *
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getOne($slug)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('t', 'pas', 's', 'pov')
            ->leftJoin('p.themes', 't', 'WITH', 't.isEnabled = :enabled')
            ->leftJoin('p.steps', 'pas')
            ->leftJoin('pas.step', 's')
            ->leftJoin('p.Cover', 'pov')
            ->andWhere('p.slug = :slug')
            ->andWhere('s.isEnabled = :enabled')
            ->setParameter('enabled', true)
            ->setParameter('slug', $slug);

        return $qb
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Get projects by user.
     *
     * @param user
     *
     * @return mixed
     */
    public function getByUser($user)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('a', 'm', 't')
            ->leftJoin('p.Author', 'a')
            ->leftJoin('a.Media', 'm')
            ->leftJoin('p.projectType', 't')
            ->andWhere('p.Author = :user')
            ->setParameter('user', $user)
            ->orderBy('p.updatedAt', 'DESC')
        ;

        return $qb
            ->getQuery()
            ->execute();
    }

    /**
     * Get one by slug with steps, events and posts.
     *
     * @param $slug
     *
     * @return mixed
     *
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getOneBySlugWithStepsAndEventsAndPosts($slug)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('t', 'pas', 's', 'pov', 'pst', 'e')
            ->leftJoin('p.themes', 't')
            ->leftJoin('p.steps', 'pas')
            ->leftJoin('pas.step', 's')
            ->leftJoin('p.Cover', 'pov')
            ->leftJoin('p.posts', 'pst', 'WITH', 'pst.isPublished = :published')
            ->leftJoin('p.events', 'e', 'WITH', 'e.isEnabled = :enabled')
            ->andWhere('p.slug = :slug')
            ->andWhere('s.isEnabled = :enabled')
            ->setParameter('slug', $slug)
            ->setParameter('published', true)
            ->setParameter('enabled', true)
            ->addOrderBy('pst.publishedAt', 'DESC')
            ->addOrderBy('e.startAt', 'DESC')
            ->addOrderBy('pas.position', 'ASC')
            ->addOrderBy('s.startAt', 'ASC')
        ;

        return $qb
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Get search results.
     *
     * @param int  $nbByPage
     * @param int  $page
     * @param null $theme
     * @param null $sort
     * @param null $term
     * @param null $type
     *
     * @return Paginator
     */
    public function getSearchResults(
        int $nbByPage = 8,
        int $page = 1,
        $theme = null,
        $sort = null,
        $term = null,
        $type = null
    ) {
        if ((int) $page < 1) {
            throw new \InvalidArgumentException(sprintf(
                'The argument "page" cannot be lower than 1 (current value: "%s")',
                $page
            ));
        }

        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('t', 'pas', 's', 'pov')
            ->leftJoin('p.themes', 't')
            ->leftJoin('p.steps', 'pas')
            ->leftJoin('pas.step', 's')
            ->leftJoin('p.Cover', 'pov')
            ->leftJoin('p.projectType', 'projectType')
            ->addOrderBy('p.publishedAt', 'DESC');

        if ($theme !== null && $theme !== Theme::FILTER_ALL) {
            $qb->andWhere('t.slug = :theme')
                ->setParameter('theme', $theme)
            ;
        }

        if ($term !== null) {
            $qb->andWhere('p.title LIKE :term')
                ->setParameter('term', '%'.$term.'%')
            ;
        }

        if ($type !== null) {
            $qb->andWhere('projectType.slug = :type')
                ->setParameter('type', $type)
            ;
        }

        if (isset(Project::$sortOrder[$sort]) && Project::$sortOrder[$sort] == Project::SORT_ORDER_CONTRIBUTIONS_COUNT) {
            $qb->orderBy('p.contributionsCount', 'DESC');
        } else {
            $qb->orderBy('p.publishedAt', 'DESC');
        }

        $query = $qb->getQuery();

        if ($nbByPage > 0) {
            $query->setFirstResult(($page - 1) * $nbByPage)
                ->setMaxResults($nbByPage);
        }

        return new Paginator($query);
    }

    /**
     * Count search results.
     *
     * @param null $themeSlug
     * @param null $term
     *
     * @return mixed
     */
    public function countSearchResults($themeSlug = null, $term = null)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->select('COUNT(p.id)')
            ->innerJoin('p.themes', 't')
        ;

        if ($themeSlug !== null && $themeSlug !== Theme::FILTER_ALL) {
            $qb->andWhere('t.slug = :themeSlug')
                ->setParameter('themeSlug', $themeSlug)
            ;
        }

        if ($term !== null) {
            $qb->andWhere('p.title LIKE :term')
                ->setParameter('term', '%'.$term.'%')
            ;
        }

        return $qb
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }

    /**
     * Get last enabled projects.
     *
     * @param int $limit
     * @param int $offset
     *
     * @return Paginator
     */
    public function getLastPublished($limit = 1, $offset = 0)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('t', 'pas', 's', 'pov')
            ->leftJoin('p.themes', 't')
            ->leftJoin('p.steps', 'pas')
            ->leftJoin('pas.step', 's')
            ->leftJoin('p.Cover', 'pov')
            ->leftJoin('p.projectType', 'type')
            ->addOrderBy('p.publishedAt', 'DESC');

        if ($limit) {
            $qb->setMaxResults($limit);
        }

        if ($offset) {
            $qb->setFirstResult($offset);
        }

        $results = new Paginator($qb, $fetchJoin = true);
        $projects = [];
        foreach ($results as $project) {
            $projects[] = $project;
        }

        return $projects;
    }

    public function getProjectsByTheme(Theme $theme, int $max = 0): array
    {
        $query = $this->getIsEnabledQueryBuilder()
            ->addSelect('t', 'pas', 's', 'pov')
            ->leftJoin('p.themes', 't')
            ->leftJoin('p.steps', 'pas')
            ->leftJoin('pas.step', 's')
            ->leftJoin('p.Cover', 'pov')
            ->leftJoin('p.projectType', 'type')
            ->andWhere('t = :theme')
            ->setParameter('theme', $theme)
            ->addOrderBy('p.publishedAt', 'DESC');

        if ($max > 0) {
            $query->setMaxResults($max)->setFirstResult(0);
        }

        return $query->getQuery()->getResult();
    }

    public function countPublished()
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->select('COUNT(p.id)')
        ;

        return $qb->getQuery()->getSingleScalarResult();
    }

    /**
     * Get last projects by theme.
     *
     * @param theme
     * @param int $limit
     * @param int $offset
     *
     * @return mixed
     */
    public function getLastByTheme($themeId, $limit = null, $offset = null)
    {
        $qb = $this->getIsEnabledQueryBuilder()
            ->addSelect('pov', 't', 'pas', 's')
            ->leftJoin('p.Cover', 'pov')
            ->leftJoin('p.themes', 't')
            ->leftJoin('p.steps', 'pas')
            ->leftJoin('pas.step', 's')
            ->andWhere(':theme MEMBER OF p.themes')
            ->setParameter('theme', $themeId)
            ->orderBy('p.publishedAt', 'DESC');

        if ($limit) {
            $qb->setMaxResults($limit);
        }

        if ($offset) {
            $qb->setFirstResult($offset);
        }

        $paginator = new Paginator($qb->getQuery());
        $projects = [];
        foreach ($paginator as $project) {
            $projects[] = $project;
        }

        return $projects;
    }

    protected function getIsEnabledQueryBuilder()
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.isEnabled = :isEnabled')
            ->setParameter('isEnabled', true);
    }
}
