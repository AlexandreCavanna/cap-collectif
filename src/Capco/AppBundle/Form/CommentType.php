<?php

namespace Capco\AppBundle\Form;

use Capco\AppBundle\Entity\Comment;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Validator\Constraints\IsTrue;

class CommentType extends AbstractType
{
    private $user;

    public function __construct(TokenStorageInterface $token)
    {
        $this->user = $token->getToken() ? $token->getToken()->getUser() : null;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        if ('edit' === $options['actionType']) {
            $builder->add('confirm', CheckboxType::class, [
                'mapped' => false,
                'label' => 'opinion.edit_check',
                'required' => true,
                'attr' => ['class' => 'confirm-edit-comment'],
                'constraints' => [new IsTrue(['message' => 'opinion.votes_not_confirmed'])],
            ]);
        }

        $builder->add('body', TextType::class, [
            'required' => true,
            'purify_html' => true,
            'purify_html_profile' => 'admin',
        ]);

        if (!$this->user || !\is_object($this->user)) {
            $builder
                ->add('authorName', TextType::class, [
                    'required' => true,
                    'purify_html' => true,
                    'purify_html_profile' => 'admin',
                ])
                ->add('authorEmail', EmailType::class, ['required' => true])
            ;
        }
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Comment::class,
            'csrf_protection' => false,
            'translation_domain' => 'CapcoAppBundle',
            'actionType' => 'create',
        ]);
    }

    public function getBlockPrefix()
    {
        return '';
    }
}
