<?php

namespace Capco\AdminBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Capco\AppBundle\Entity\Consultation;
use Capco\AppBundle\Entity\Step;
use Symfony\Component\Validator\Constraints\DateTime;

class ConsultationAdmin extends Admin
{
    protected $datagridValues = array(
        '_sort_order' => 'ASC',
        '_sort_by' => 'title',
    );

    /**
     * @param DatagridMapper $datagridMapper
     */
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('title', null, array(
                'label' => 'admin.fields.consultation.title',
            ))
            ->add('Author', null, array(
                'label' => 'admin.fields.consultation.author',
            ))
        ;

        if ($this->getConfigurationPool()->getContainer()->get('capco.toggle.manager')->isActive('themes')) {
            $datagridMapper->add('Themes', null, array(
                'label' => 'admin.fields.consultation.themes',
                ));
        }

        $datagridMapper
            ->add('Steps', null, array(
                'label' => 'admin.fields.consultation.steps',
            ))
            ->add('events', null, array(
                'label' => 'admin.fields.consultation.events',
            ))
            ->add('posts', null, array(
                'label' => 'admin.fields.consultation.posts',
            ))
            ->add('allowedTypes', null, array(
                'label' => 'admin.fields.consultation.allowed_types',
            ))
            ->add('opinionCount', null, array(
                'label' => 'admin.fields.consultation.opinion_count',
            ))
            ->add('argumentCount', null, array(
                'label' => 'admin.fields.consultation.argument_count',
            ))
            ->add('isEnabled', null, array(
                'label' => 'admin.fields.consultation.is_enabled',
            ))
            ->add('updatedAt', null, array(
                'label' => 'admin.fields.consultation.updated_at',
            ))
        ;
    }

    /**
     * @param ListMapper $listMapper
     */
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('title', null, array(
                'label' => 'admin.fields.consultation.title',
            ))
            ->add('Author', 'sonata_type_model', array(
                'label' => 'admin.fields.consultation.author',
            ))
        ;

        if ($this->getConfigurationPool()->getContainer()->get('capco.toggle.manager')->isActive('themes')) {
            $listMapper->add('Themes', null, array(
                'label' => 'admin.fields.consultation.themes',
            ));
        }

        $listMapper
            ->add('openingStatus', null, array(
                'label' => 'admin.fields.consultation.opening_status',
                'mapped' => false,
                'template' => 'CapcoAdminBundle:Consultation:openingStatus_list_field.html.twig',
                'statuses' => Consultation::$openingStatuses,
            ))
            ->add('openedAt', null, array(
                'label' => 'admin.fields.consultation.opened_at',
                'mapped' => false,
                'template' => 'CapcoAdminBundle:Consultation:openedAt_list_field.html.twig',
            ))
            ->add('closedAt', null, array(
                'label' => 'admin.fields.consultation.closed_at',
                'mapped' => false,
                'template' => 'CapcoAdminBundle:Consultation:closedAt_list_field.html.twig',
            ))
            ->add('opinionCount', null, array(
                'label' => 'admin.fields.consultation.opinion_count',
            ))
            ->add('argumentCount', null, array(
                'label' => 'admin.fields.consultation.argument_count',
            ))
            ->add('eventsCount', null, array(
                'label' => 'admin.fields.consultation.events_count',
                'template' => 'CapcoAdminBundle:Consultation:events_count_list_field.html.twig',
            ))
            ->add('postsCount', null, array(
                'label' => 'admin.fields.consultation.posts_count',
                'template' => 'CapcoAdminBundle:Consultation:posts_count_list_field.html.twig',
            ))
            ->add('isEnabled', null, array(
                'editable' => true,
                'label' => 'admin.fields.consultation.is_enabled',
            ))
            ->add('updatedAt', null, array(
                'label' => 'admin.fields.consultation.updated_at',
            ))
            ->add('_action', 'actions', array(
                'actions' => array(
                    'show' => array(),
                    'download' => array(
                        'template' => 'CapcoAdminBundle:CRUD:list__action_download.html.twig',
                    ),
                    'edit' => array(),
                    'delete' => array(),
                ),
            ))
        ;
    }

    /**
     * @param FormMapper $formMapper
     */
    protected function configureFormFields(FormMapper $formMapper)
    {
        $subject = $this->getSubject();
        $open = null;
        $close = null;
        $stepTitle = 'Consultation';
        $stepPosition = 1;
        if ($subject != null) {
            $open = $subject->getOpenedAt();
            $close = $subject->getClosedAt();
            $consultationStep = $subject->getConsultationStep();
            if (null != $consultationStep) {
                $stepTitle = $consultationStep->getTitle();
                $stepPosition = $consultationStep->getPosition();
            }
        }

        $formMapper
            ->with('admin.fields.consultation.group_content', array('class' => 'col-md-12'))->end()
            ->with('admin.fields.consultation.group_meta', array('class' => 'col-md-6'))->end()
            ->with('admin.fields.consultation.group_opinion_types', array('class' => 'col-md-6'))->end()
            ->with('admin.fields.consultation.group_steps', array('class' => 'col-md-12'))->end()
            ->end()
        ;

        $formMapper
            // Content
            ->with('admin.fields.consultation.group_content')
            ->add('title', null, array(
                'label' => 'admin.fields.consultation.title',
            ))
            ->add('body', null, array(
                'label' => 'admin.fields.consultation.body',
                'required' => false,
                'attr' => array('rows' => 10),
            ))
            ->add('Author', 'sonata_type_model', array(
                'label' => 'admin.fields.consultation.author',
            ))
            ->end()

            // Metadata
            ->with('admin.fields.consultation.group_meta')
            ->add('isEnabled', null, array(
                'label' => 'admin.fields.consultation.is_enabled',
                'required' => false,
            ))
        ;

        if ($this->getConfigurationPool()->getContainer()->get('capco.toggle.manager')->isActive('themes')) {
            $formMapper
                ->add('Themes', 'sonata_type_model', array(
                'label' => 'admin.fields.consultation.themes',
                'required' => false,
                'multiple' => true,
                'by_reference' => false,
            ));
        }

        $formMapper
            ->add('Cover', 'sonata_type_model_list', array(
                'required' => false,
                'label' => 'admin.fields.consultation.cover',
            ), array(
                'link_parameters' => array(
                    'context' => 'default',
                    'hide_context' => true,
                    'provider' => 'sonata.media.provider.image',
                ),
            ))
            ->add('video', null, array(
                'label' => 'admin.fields.consultation.video',
                'required' => false,
                'help' => 'admin.help.consultation.video',
                ), array(
                    'link_parameters' => array('context' => 'consultation'),
            ))
            ->end()

            // Opinion types
            ->with('admin.fields.consultation.group_opinion_types')
            ->add('consultationType', 'sonata_type_model', array(
                'label' => 'admin.fields.consultation.consultation_type',
                'required' => false,
                'mapped' => false,
                'class' => 'Capco\AppBundle\Entity\ConsultationType',
                'help' => 'admin.help.consultation.consultation_type',
            ))
            ->add('allowedTypes', 'sonata_type_model', array(
                'label' => 'admin.fields.consultation.allowed_types',
                'required' => false,
                'multiple' => true,
                'by_reference' => false,
                'expanded' => true,
            ))
            ->end()

            // Steps
            ->with('admin.fields.consultation.group_steps')
            ->add('openedAt', 'sonata_type_datetime_picker', array(
                'required' => true,
                'mapped' => false,
                'data' => $open,
                'label' => 'admin.fields.consultation.opened_at',
                'format' => 'dd/MM/yyyy HH:mm',
                'attr' => array(
                    'data-date-format' => 'DD/MM/YYYY HH:mm',
                ),
            ))
             ->add('closedAt', 'sonata_type_datetime_picker', array(
                'required' => true,
                'mapped' => false,
                'data' => $close,
                 'help' => 'admin.help.consultation.closed_at',
                 'label' => 'admin.fields.consultation.closed_at',
                 'format' => 'dd/MM/yyyy HH:mm',
                 'attr' => array(
                     'data-date-format' => 'DD/MM/YYYY HH:mm',
                 ),
             ))
            ->add('consultationStepTitle', 'text', array(
                'required' => true,
                'mapped' => false,
                'data' => $stepTitle,
                'label' => 'admin.fields.consultation.step_title',
            ))
            ->add('consultationStepPosition', 'integer', array(
                'required' => true,
                'mapped' => false,
                'data' => $stepPosition,
                'label' => 'admin.fields.consultation.step_position',
            ))
        ;
    }

    /**
     * @param ShowMapper $showMapper
     */
    protected function configureShowFields(ShowMapper $showMapper)
    {
        $subject = $this->getSubject();

        $showMapper
            ->add('title', null, array(
                'label' => 'admin.fields.consultation.title',
            ))
            ->add('isEnabled', 'boolean', array(
                'label' => 'admin.fields.consultation.is_enabled',
            ))
            ->add('Author', null, array(
                'label' => 'admin.fields.consultation.author',
            ))
            ->add('body', null, array(
                'label' => 'admin.fields.consultation.body',
            ))
            ->add('Cover', null, array(
                'template' => 'CapcoAdminBundle:Consultation:cover_show_field.html.twig',
                'label' => 'admin.fields.consultation.cover',
            ))
            ->add('video', null, array(
                'label' => 'admin.fields.consultation.video',
            ))
        ;

        if ($this->getConfigurationPool()->getContainer()->get('capco.toggle.manager')->isActive('themes')) {
            $showMapper->add('Themes', null, array(
                'label' => 'admin.fields.consultation.themes',
            ));
        }

        $showMapper
            ->add('allowedTypes', null, array(
                'label' => 'admin.fields.consultation.allowed_types',
            ))
            ->add('Steps', null, array(
                'label' => 'admin.fields.consultation.steps',
            ))
            ->add('openingStatus', null, array(
                'label' => 'admin.fields.consultation.opening_status',
                'template' => 'CapcoAdminBundle:Consultation:openingStatus_show_field.html.twig',
                'statuses' => Consultation::$openingStatuses,
            ))
            ->add('openedAt', 'datetime', array(
                'label' => 'admin.fields.consultation.opened_at',
            ))
            ->add('closedAt', 'datetime', array(
                'label' => 'admin.fields.consultation.closed_at',
            ))
            ->add('consultationStepTitle', 'text', array(
                'label' => 'admin.fields.consultation.step_title',
            ))
            ->add('consultationStepPosition', 'integer', array(
                'label' => 'admin.fields.consultation.step_position',
            ))
            ->add('opinionCount', null, array(
                'label' => 'admin.fields.consultation.opinion_count',
            ))
            ->add('argumentCount', null, array(
                'label' => 'admin.fields.consultation.argument_count',
            ))
            ->add('events', null, array(
                'label' => 'admin.fields.consultation.events',
            ))
            ->add('posts', null, array(
                'label' => 'admin.fields.consultation.posts',
            ))
            ->add('trashedOpinionCount', null, array(
                'label' => 'admin.fields.consultation.trashed_opinion_count',
            ))
            ->add('trashedArgumentCount', null, array(
                'label' => 'admin.fields.consultation.trashed_argument_count',
            ))
            ->add('createdAt', null, array(
                'label' => 'admin.fields.consultation.created_at',
            ))
            ->add('updatedAt', null, array(
                'label' => 'admin.fields.consultation.updated_at',
            ))
        ;
    }

    public function prePersist($consultation)
    {
        $this->setConsultationStep($consultation);
    }

    public function preUpdate($consultation)
    {
        $this->setConsultationStep($consultation);
    }

    private function setConsultationStep($consultation)
    {
        $consultationStep = $consultation->getConsultationStep();
        if ($consultationStep == null) {
            $consultationStep = new Step();
            $consultationStep->setType(Step::$stepTypes['consultation']);
            $consultationStep->setConsultation($consultation);
        }

        $openingDate = $this->getForm()->get('openedAt')->getData();
        $closingDate = $this->getForm()->get('closedAt')->getData();
        $title = $this->getForm()->get('consultationStepTitle')->getData();
        $position = $this->getForm()->get('consultationStepPosition')->getData();

        $consultationStep->setStartAt($openingDate);
        $consultationStep->setEndAt($closingDate);
        $consultationStep->setTitle($title);
        $consultationStep->setPosition($position);

        $consultation->addStep($consultationStep);
    }

    protected function configureRoutes(RouteCollection $collection)
    {
        $collection->add('download', $this->getRouterIdParameter().'/download');
        $collection->add('getAllowedTypesFromConsultationType', 'allowed_types_from_consultation_types');
    }

    public function getTemplate($name)
    {
        if ($name == 'edit') {
            return 'CapcoAdminBundle:Consultation:edit.html.twig';
        }

        return parent::getTemplate($name);
    }
}
