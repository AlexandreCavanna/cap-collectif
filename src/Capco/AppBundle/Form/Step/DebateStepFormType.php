<?php

namespace Capco\AppBundle\Form\Step;

use Capco\AppBundle\Entity\Debate\DebateArticle;
use Capco\AppBundle\Entity\Steps\DebateStep;
use Capco\AppBundle\Enum\DebateType;
use Capco\AppBundle\Form\DebateArticleType;
use Capco\AppBundle\Form\Type\OrderedCollectionType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DebateStepFormType extends AbstractStepFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);
        $builder->add('articles', OrderedCollectionType::class, [
            'entry_type' => DebateArticleType::class,
            'on_update' => static function (
                DebateArticle $itemFromDb,
                DebateArticle $itemFromUser
            ) {
                $itemFromDb->setUrl($itemFromUser->getUrl());
            },
        ]);
        $builder->add('debateType', ChoiceType::class, [
            'choices' => [
                DebateType::WYSIWYG => DebateType::WYSIWYG,
                DebateType::FACE_TO_FACE => DebateType::FACE_TO_FACE,
            ],
        ]);
        $builder->add('debateContent', TextType::class, [
            'purify_html' => true,
            'purify_html_profile' => 'admin',
        ]);
        $builder->add('debateContentUsingJoditWysiwyg');
        $builder
            ->add('isAnonymousParticipationAllowed')
            ->add('articles', OrderedCollectionType::class, [
                'entry_type' => DebateArticleType::class,
                'on_update' => static function (
                    DebateArticle $itemFromDb,
                    DebateArticle $itemFromUser
                ) {
                    $itemFromDb->setUrl($itemFromUser->getUrl());
                },
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'csrf_protection' => false,
            'data_class' => DebateStep::class,
        ]);
    }
}
