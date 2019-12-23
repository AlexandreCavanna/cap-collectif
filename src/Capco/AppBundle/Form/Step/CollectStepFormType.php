<?php

namespace Capco\AppBundle\Form\Step;

use Capco\AppBundle\Entity\Status;
use Capco\AppBundle\Entity\Steps\CollectStep;
use Capco\AppBundle\Form\StatusFormType;
use Capco\AppBundle\Form\Type\OrderedCollectionType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CollectStepFormType extends AbstractStepFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        $builder
            ->add('votesHelpText')
            ->add('private')
            ->add('voteType')
            ->add('budget')
            ->add('votesLimit')
            ->add('votesRanking')
            ->add('voteThreshold')
            ->add('proposalForm')
            ->add('statuses', OrderedCollectionType::class, [
                'entry_type' => StatusFormType::class,
                'on_update' => static function (Status $itemFromDb, Status $itemFromUser) {
                    $itemFromDb
                        ->setName($itemFromUser->getName())
                        ->setColor($itemFromUser->getColor());
                }
            ])
            ->add('defaultSort')
            ->add('defaultStatus');
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'csrf_protection' => false,
            'data_class' => CollectStep::class
        ]);
    }
}