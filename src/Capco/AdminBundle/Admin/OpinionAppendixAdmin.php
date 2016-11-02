<?php

namespace Capco\AdminBundle\Admin;

use Ivory\CKEditorBundle\Form\Type\CKEditorType;
use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class OpinionAppendixAdmin extends Admin
{
    protected $datagridValues = [
        '_sort_order' => 'ASC',
        '_sort_by' => 'type',
    ];

    /**
     * @param FormMapper $formMapper
     */
    protected function configureFormFields(FormMapper $formMapper)
    {
        $subject = $this->getSubject();

        $formMapper
            ->add('type', TextType::class, [
                'label' => 'admin.fields.appendix.type',
                'mapped' => false,
                'data' => $subject->getAppendixType(),
                'attr' => [
                    'read-only' => true,
                    'disabled' => true,
                ],
            ])
            ->add('appendixType', HiddenType::class, [
                'property_path' => 'appendixType.id',
            ])
            ->add('body', CKEditorType::class, [
                'label' => 'admin.fields.appendix.body',
                'config_name' => 'admin_editor',
                'required' => false,
            ])
        ;
    }

    protected function configureRoutes(RouteCollection $collection)
    {
        $collection->clearExcept(['create', 'delete', 'edit']);
    }
}
