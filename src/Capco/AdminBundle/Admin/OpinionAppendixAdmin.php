<?php

namespace Capco\AdminBundle\Admin;

use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollectionInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class OpinionAppendixAdmin extends AbstractAdmin
{
    protected array $datagridValues = [
        '_sort_order' => 'ASC',
        '_sort_by' => 'type',
    ];

    protected function configureFormFields(FormMapper $form): void
    {
        $subject = $this->getSubject();

        $form
            ->add('type', TextType::class, [
                'label' => 'global.type',
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
                'label' => 'global.contenu',
                'config_name' => 'admin_editor',
                'required' => false,
            ]);
    }

    protected function configureRoutes(RouteCollectionInterface $collection): void
    {
        $collection->clearExcept(['create', 'delete', 'edit', 'show']);
    }
}
