<?php

namespace spec\Capco\AppBundle\Synthesis\Extractor;

use Capco\AppBundle\Entity\Argument;
use Capco\AppBundle\Entity\ConsultationStep;
use Capco\AppBundle\Entity\Opinion;
use Capco\AppBundle\Entity\Synthesis\Synthesis;
use Capco\AppBundle\Entity\Synthesis\SynthesisElement;
use Doctrine\Common\Collections\ArrayCollection;
use PhpSpec\ObjectBehavior;
use Doctrine\ORM\EntityManager;

class ConsultationStepExtractorSpec extends ObjectBehavior
{
    function it_is_initializable()
    {
        $this->shouldHaveType('Capco\AppBundle\Synthesis\Extractor\ConsultationStepExtractor');
    }

    /*function it_can_create_elements_from_consultation_step(EntityManager $em, Synthesis $synthesis, ConsultationStep $consultationStep, SynthesisElement $element1, SynthesisElement $element2, SynthesisElement $element3, Opinion $opinion1, Opinion $opinion2, Argument $argument1, Argument $argument2, Argument $argument3, Argument $argument4, SynthesisElement $elementFromOpinion2, SynthesisElement $elementFromArgument1, SynthesisElement $elementFromArgument3)
    {
        $currentElements = new ArrayCollection([$element1, $element2, $element3]);

        $opinions = new ArrayCollection([$opinion1, $opinion2]);

        $opinion1Arguments = new ArrayCollection([$argument1, $argument2]);
        $opinion2Arguments = new ArrayCollection([$argument3, $argument4]);

        $synthesis->getElements()->willReturn($currentElements)->shouldBeCalled();
        $consultationStep->getOpinions()->willReturn($opinions)->shouldBeCalled();

        // Opinion 1 (already linked to element1)
        $this->isElementRelated($element1, $opinion1)->willReturn(true)->shouldBeCalled();
        $this->isElementRelated($element2, $opinion1)->shouldNotBeCalled();
        $this->isElementRelated($element3, $opinion1)->shouldNotBeCalled();
        $this->createElementFromOpinion($opinion1)->shouldNotBeCalled();

        $opinion1->getArguments()->willReturn($opinion1Arguments)->shouldBeCalled();

        // Argument 1 (not linked)
        $this->isElementRelated($element1, $argument1)->willReturn(false)->shouldBeCalled();
        $this->isElementRelated($element2, $argument1)->willReturn(false)->shouldBeCalled();
        $this->isElementRelated($element3, $argument1)->willReturn(false)->shouldBeCalled();
        $this->createElementFromArgument($argument1)->willReturn($elementFromArgument1)->shouldBeCalled();
        $elementFromArgument1->setParent($element1)->shouldBeCalled();

        // Argument 2 (already linked to element2)
        $this->isElementRelated($element1, $argument1)->willReturn(false)->shouldBeCalled();
        $this->isElementRelated($element2, $argument1)->willReturn(true)->shouldBeCalled();
        $this->isElementRelated($element3, $argument1)->shouldNotBeCalled();
        $this->createElementFromArgument($argument2)->shouldNotBeCalled();

        // Opinion 2 (not linked)
        $this->isElementRelated($element1, $opinion2)->willReturn(false)->shouldBeCalled();
        $this->isElementRelated($element2, $opinion2)->willReturn(false)->shouldBeCalled();
        $this->isElementRelated($element3, $opinion2)->willReturn(false)->shouldBeCalled();
        $this->createElementFromOpinion($opinion2)->willReturn($elementFromOpinion2)->shouldBeCalled();

        $opinion2->getArguments()->willReturn($opinion2Arguments)->shouldBeCalled();

        // Argument 3 (not linked)
        $this->isElementRelated($element1, $argument3)->willReturn(false)->shouldBeCalled();
        $this->isElementRelated($element2, $argument3)->willReturn(false)->shouldBeCalled();
        $this->isElementRelated($element3, $argument3)->willReturn(false)->shouldBeCalled();
        $this->createElementFromArgument($argument3)->willReturn($elementFromArgument3)->shouldBeCalled();
        $elementFromArgument3->setParent($elementFromOpinion2)->shouldBeCalled();

        // Argument 4 (already linked to element3)
        $this->isElementRelated($element1, $argument4)->willReturn(false)->shouldBeCalled();
        $this->isElementRelated($element2, $argument4)->willReturn(false)->shouldBeCalled();
        $this->isElementRelated($element3, $argument4)->willReturn(true)->shouldBeCalled();
        $this->createElementFromArgument($argument4)->shouldNotBeCalled();

        $elementFromOpinion2->setSynthesis($synthesis)->shouldBeCalled();
        $em->persist($elementFromOpinion2)->shouldBeCalled();
        $elementFromArgument1->setSynthesis($synthesis)->shouldBeCalled();
        $em->persist($elementFromArgument1)->shouldBeCalled();
        $elementFromArgument3->setSynthesis($synthesis)->shouldBeCalled();
        $em->persist($elementFromArgument3)->shouldBeCalled();

        $em->flush()->shouldBeCalled();

        $this->beConstructedWith($em);
        $this->createElementsFromConsultationStep($synthesis)->shouldReturn(true);
    }

    function it_can_tell_if_element_is_related_to_object(SynthesisElement $element, SynthesisElement $object)
    {
        // Related element (same class, same id)
        $object->getId()->willReturn(42)->shouldBeCalled();
        $element->getLinkedDataClass()->willReturn('Capco\AppBundle\Entity\Synthesis\SynthesisElement')->shouldBeCalled();
        $element->getLinkedDataId()->willReturn(42)->shouldBeCalled();
        $this->isElementRelated($object, $element)->shouldReturn(true);

        // Not related (different id)
        $object->getId()->willReturn(42)->shouldBeCalled();
        $element->getLinkedDataClass()->willReturn('Capco\AppBundle\Entity\Synthesis\SynthesisElement')->shouldBeCalled();
        $element->getLinkedDataId()->willReturn(51)->shouldBeCalled();
        $this->isElementRelated($object, $element)->shouldReturn(true);

        // Not related (different class)
        $object->getId()->willReturn(42)->shouldBeCalled();
        $element->getLinkedDataClass()->willReturn('Capco\AppBundle\Entity\Synthesis\Test')->shouldBeCalled();
        $element->getLinkedDataId()->willReturn(42)->shouldBeCalled();
        $this->isElementRelated($object, $element)->shouldReturn(true);

        // Not related (both different)
        $object->getId()->willReturn(42)->shouldBeCalled();
        $element->getLinkedDataClass()->willReturn('Capco\AppBundle\Entity\Synthesis\Test')->shouldBeCalled();
        $element->getLinkedDataId()->willReturn(51)->shouldBeCalled();
        $this->isElementRelated($object, $element)->shouldReturn(true);
    }

    function it_can_create_an_element_from_opinion(Opinion $opinion)
    {
        $opinion->getTitle()->willReturn('test')->shouldBeCalled();
        $opinion->getBody()->willReturn('blabla')->shouldBeCalled();
        $opinion->getId()->willReturn(42)->shouldBeCalled();

        $element = $this->createElementFromOpinion($opinion);
        $element->shouldBeAnInstanceOf('Capco\AppBundle\Entity\Synthesis\SynthesisElement');
        $element->getTitle()->shouldReturn('test');
        $element->getBody()->shouldReturn('blabla');
        $element->getLinkedDataId()->shouldReturn(42);
    }

    function it_can_create_an_element_from_argument(Argument $argument)
    {
        $argument->getBody()->willReturn('blabla')->shouldBeCalled();
        $argument->getId()->willReturn(42)->shouldBeCalled();

        $element = $this->createElementFromArgument($argument);
        $element->shouldBeAnInstanceOf('Capco\AppBundle\Entity\Synthesis\SynthesisElement');
        $element->getBody()->shouldReturn('blabla');
        $element->getLinkedDataId()->shouldReturn(42);
    }*/

}
