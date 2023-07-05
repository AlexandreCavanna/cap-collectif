<?php

namespace Capco\AppBundle\Form;

use Capco\AppBundle\Entity\Group;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class GroupCreateType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('title', TextType::class, [
            'required' => true,
            'purify_html' => true,
            'purify_html_profile' => 'admin',
        ]);
        $builder->add('description', TextType::class, [
            'required' => false,
            'purify_html' => true,
            'purify_html_profile' => 'admin',
        ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'csrf_protection' => false,
            'data_class' => Group::class,
        ]);
    }
}
