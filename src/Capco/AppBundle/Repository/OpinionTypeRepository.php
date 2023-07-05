<?php

namespace Capco\AppBundle\Repository;

use Capco\AppBundle\Entity\Consultation;
use Capco\AppBundle\Entity\OpinionType;
use Capco\AppBundle\Entity\Steps\ConsultationStep;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;

/**
 * OpinionTypeRepository.
 *
 * @method null|OpinionType find($id, $lockMode = null, $lockVersion = null)
 * @method null|OpinionType findOneBy(array $criteria, array $orderBy = null)
 * @method OpinionType[]    findAll()
 * @method OpinionType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OpinionTypeRepository extends EntityRepository
{
    public function childrenHierarchy(OpinionType $parent)
    {
        $children = $this->getChildren($parent);
        foreach ($children as &$child) {
            $child['__children'] = $this->childrenHierarchy($this->find($child['id']));
        }

        return $children;
    }

    public function getAsArrayById(string $id)
    {
        $qb = $this->createQueryBuilder('ot')
            ->where('ot.id = :id')
            ->setParameter('id', $id)
        ;

        return $qb->getQuery()->getSingleResult(Query::HYDRATE_ARRAY);
    }

    public function getChildren(OpinionType $parent)
    {
        $qb = $this->createQueryBuilder('ot')
            ->andWhere('ot.parent = :parent')
            ->orderBy('ot.position', 'ASC')
            ->setParameter('parent', $parent)
        ;

        return $qb->getQuery()->getArrayResult();
    }

    public function getOrderedRootNodesQueryBuilder(
        ?Consultation $consultation = null
    ): QueryBuilder {
        $qb = $this->createQueryBuilder('ot')
            ->addSelect(
                '(COALESCE(p.position, ot.position) * 100 + (
                    CASE
                    WHEN p.position IS NULL THEN 0
                    ELSE ot.position
                END)) AS HIDDEN computed_position'
            )
            ->leftJoin('ot.parent', 'p', 'ot.parent = p.id')
            ->addOrderBy('computed_position')
            ->addOrderBy('ot.parent')
        ;

        if ($consultation) {
            $qb->andWhere('ot.consultation = :c')->setParameter('c', $consultation);
        } else {
            $qb->andWhere('ot.consultation IS NULL');
        }

        return $qb;
    }

    /**
     * Get all opinionTypes with opinions for user.
     *
     * @param $user
     *
     * @return array
     */
    public function getByUser($user)
    {
        $qb = $this->createQueryBuilder('ot')
            ->addSelect('o', 's', 'pas', 'p', 'oc')
            ->leftJoin('ot.Opinions', 'o')
            ->leftJoin('o.consultation', 'oc')
            ->leftJoin('oc.step', 's')
            ->leftJoin('s.projectAbstractStep', 'pas')
            ->leftJoin('pas.project', 'p')
            ->andWhere('s.isEnabled = :enabled')
            ->andWhere('o.published = :enabled')
            ->andWhere('o.author = :author')
            ->setParameter('enabled', true)
            ->setParameter('author', $user)
            ->orderBy('ot.position', 'ASC')
            ->addOrderBy('o.createdAt', 'DESC')
        ;

        return $qb->getQuery()->getResult();
    }

    /**
     * Count all opinionTypes with opinions for user.
     *
     * @param $user
     *
     * @return array
     */
    public function countByUser($user): int
    {
        $qb = $this->createQueryBuilder('ot')
            ->addSelect('o', 's', 'cas', 'p', 'oc')
            ->join('ot.Opinions', 'o')
            ->join('o.consultation', 'oc')
            ->leftJoin('oc.step', 's')
            ->leftJoin('s.projectAbstractStep', 'pas')
            ->leftJoin('pas.project', 'p')
            ->addGroupBy('ot.id')
            ->andWhere('o.author = :author')
            ->andWhere('o.published = :enabled')
            ->andWhere('s.isEnabled = :enabled')
            ->setParameter('enabled', true)
            ->setParameter('author', $user)
            ->orderBy('ot.position', 'ASC')
            ->addOrderBy('o.createdAt', 'DESC')
        ;

        return (int) $qb->getQuery()->getScalarResult();
    }

    /**
     * Get all opinionTypes with opinions count for consultation step.
     *
     * @param $step
     * @param $allowedTypes
     *
     * @return array
     */
    public function getAllowedTypesWithOpinionCount(ConsultationStep $step, $allowedTypes)
    {
        $qb = $this->createQueryBuilder('ot')
            ->select(
                'ot.id',
                'ot.title',
                'ot.color',
                'ot.isEnabled',
                'ot.slug',
                'ot.defaultFilter',
                'count(o.id) as total_opinions_count'
            )
            ->leftJoin('ot.Opinions', 'o', 'WITH', 'o.published = :enabled AND o.trashedAt IS NULL')
            ->innerJoin('o.consultation', 'oc', 'WITH', 'oc.step = :step')
            ->andWhere('ot IN (:allowedTypes)')
            ->setParameter('step', $step)
            ->setParameter('enabled', true)
            ->setParameter('allowedTypes', $allowedTypes)
            ->addGroupBy('ot')
            ->orderBy('ot.position', 'ASC')
        ;

        return $qb->getQuery()->getArrayResult();
    }

    /**
     * Get all opinionTypes.
     *
     * @return array
     */
    public function getOrderedByPosition()
    {
        $qb = $this->createQueryBuilder('ot')->orderBy('ot.position', 'ASC');

        return $qb->getQuery()->getResult();
    }

    public function getRootOpinionTypes()
    {
        $qb = $this->createQueryBuilder('ot')
            ->where('ot.parent IS NULL')
            ->orderBy('ot.position', 'ASC')
        ;

        return $qb->getQuery()->getResult();
    }

    public function findOneByConsultationAndStepAndSlug(
        Consultation $consultation,
        ConsultationStep $step,
        string $slug
    ): ?OpinionType {
        $qb = $this->createQueryBuilder('ot')
            ->leftJoin('ot.consultation', 'otc')
            ->leftJoin('otc.step', 's')
            ->andWhere('ot.slug = :slug')
            ->andWhere('s.slug = :stepSlug')
            ->andWhere('otc.slug = :consultationSlug')
            ->setParameters([
                'slug' => $slug,
                'stepSlug' => $step->getSlug(),
                'consultationSlug' => $consultation->getSlug(),
            ])
        ;

        return $qb->getQuery()->getOneOrNullResult();
    }

    public function getLinkableOpinionTypesForConsultation(Consultation $consultation)
    {
        $qb = $this->createQueryBuilder('ot')
            ->addSelect('otat', 'at')
            ->leftJoin('ot.appendixTypes', 'otat')
            ->leftJoin('otat.appendixType', 'at')
            ->andWhere('ot.isEnabled = :enabled')
            ->andWhere('ot.linkable = :linkable')
            ->andWhere('ot.consultation = :consultation')
            ->setParameter('enabled', true)
            ->setParameter('linkable', true)
            ->setParameter('consultation', $consultation)
        ;

        return $qb->getQuery()->getResult();
    }
}
