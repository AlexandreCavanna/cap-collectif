<?php

namespace Capco\AdminBundle\Admin;

use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class ProposalFormNotificationConfigurationAdmin extends AbstractAdmin
{
    protected function configureFormFields(FormMapper $form): void
    {
        $form
            ->add('onCreate', CheckboxType::class, [
                'label' => 'proposal_form.notifications.on_create',
                'required' => false,
            ])
            ->add('onUpdate', CheckboxType::class, [
                'label' => 'global.modified',
                'required' => false,
            ])
            ->add('onDelete', CheckboxType::class, [
                'label' => 'global.deleted.feminine',
                'required' => false,
            ])
            ->end()
        ;
    }
}
