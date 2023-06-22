<?php

namespace Capco\AppBundle\GraphQL\Mutation;

use Capco\AppBundle\Form\SectionType;
use Capco\AppBundle\GraphQL\Mutation\Locale\LocaleUtils;
use Capco\AppBundle\Repository\SectionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Overblog\GraphQLBundle\Definition\Argument;
use Overblog\GraphQLBundle\Definition\Resolver\MutationInterface;
use Symfony\Component\Form\FormFactoryInterface;

class UpdateHomePageProjectsMapSectionConfigurationMutation implements MutationInterface
{
    public const INVALID_FORM = 'INVALID_FORM';

    private EntityManagerInterface $em;
    private SectionRepository $sectionRepository;
    private FormFactoryInterface $formFactory;

    public function __construct(
        EntityManagerInterface $em,
        SectionRepository $sectionRepository,
        FormFactoryInterface $formFactory
    ) {
        $this->em = $em;
        $this->sectionRepository = $sectionRepository;
        $this->formFactory = $formFactory;
    }

    public function __invoke(Argument $args): array
    {
        $section = $this->sectionRepository->findOneBy(['type' => 'projectsMap']);

        $arguments = $args->getArrayCopy();
        LocaleUtils::indexTranslations($arguments);

        $form = $this->formFactory->create(SectionType::class, $section);
        $form->submit($arguments, false);

        if ($form->isSubmitted() && !$form->isValid()) {
            return ['errorCode' => self::INVALID_FORM];
        }

        $this->em->persist($section);
        $this->em->flush();

        return ['homePageProjectsMapSectionConfiguration' => $section, 'errorCode' => null];
    }
}
