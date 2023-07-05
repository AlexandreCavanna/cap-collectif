<?php

namespace Capco\AppBundle\Form;

use Capco\AppBundle\Entity\District\ProposalDistrict;
use Capco\AppBundle\Validator\Constraints\CheckGeoJson;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProposalDistrictAdminType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, [
                'purify_html' => true,
                'purify_html_profile' => 'admin',
            ])
            ->add('geojson', TextType::class, [
                'constraints' => [new CheckGeoJson()],
            ])
            ->add('geojsonStyle')
            ->add('displayedOnMap', CheckboxType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => ProposalDistrict::class,
            'csrf_protection' => false,
        ]);
    }
}
