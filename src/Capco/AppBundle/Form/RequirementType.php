<?php

namespace Capco\AppBundle\Form;

use Capco\AppBundle\Entity\Requirement;
use Capco\AppBundle\Form\Type\RelayGlobalIdType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RequirementType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('id', RelayGlobalIdType::class)
            ->add('type')
            ->add('label', null, ['required' => false])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'csrf_protection' => false,
            'data_class' => Requirement::class,
        ]);
    }
}
