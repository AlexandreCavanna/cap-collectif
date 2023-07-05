<?php

namespace Capco\UserBundle\Form\Type;

use Capco\AppBundle\Form\Type\PurifiedTextType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ApiAdminRegistrationFormType extends ApiRegistrationFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        $builder->add('username', PurifiedTextType::class, [
            'required' => true,
            'purify_html' => true,
            'strip_tags' => true,
            'purify_html_profile' => 'admin',
        ]);
        $builder->add('email', EmailType::class, ['required' => true]);
        $builder->add('roles', CollectionType::class, ['entry_type' => TextType::class]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        parent::configureOptions($resolver);
        $resolver->setDefaults(['validation_groups' => ['registrationAdmin']]);
    }
}
