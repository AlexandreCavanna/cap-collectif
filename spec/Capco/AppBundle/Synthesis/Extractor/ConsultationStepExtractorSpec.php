<?php

namespace spec\Capco\AppBundle\Synthesis\Extractor;

use PhpSpec\ObjectBehavior;
use Doctrine\ORM\EntityManager;
use Capco\AppBundle\Entity\ConsultationStep;
use Capco\AppBundle\Entity\Opinion;
use Capco\AppBundle\Entity\Argument;
use Capco\AppBundle\Entity\Synthesis\Synthesis;
use Capco\AppBundle\Entity\Synthesis\SynthesisElement;
use Doctrine\Common\Collections\ArrayCollection;
use Prophecy\Argument as ProphecyArgument;

class ConsultationStepExtractorSpec extends ObjectBehavior
{
    function let(EntityManager $em)
    {
        $this->beConstructedWith($em);
    }

    function it_is_initializable()
    {
        $this->shouldHaveType('Capco\AppBundle\Synthesis\Extractor\ConsultationStepExtractor');
    }

    function it_can_create_an_element_from_an_opinion(Opinion $opinion)
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

    function it_can_create_an_element_from_an_argument(Argument $argument)
    {
        $argument->getBody()->willReturn('blabla')->shouldBeCalled();
        $argument->getId()->willReturn(42)->shouldBeCalled();

        $element = $this->createElementFromArgument($argument);
        $element->shouldBeAnInstanceOf('Capco\AppBundle\Entity\Synthesis\SynthesisElement');
        $element->getBody()->shouldReturn('blabla');
        $element->getLinkedDataId()->shouldReturn(42);
    }

    function it_can_tell_if_element_is_related_to_object(SynthesisElement $element)
    {
        // Can't mock opinion because we need to call get_class() method on it
        $opinion = new Opinion();
        $opinion->setId(42);

        // Related element (same class, same id)
        $element->getLinkedDataClass()->willReturn('Capco\AppBundle\Entity\Opinion')->shouldBeCalled();
        $element->getLinkedDataId()->willReturn(42)->shouldBeCalled();
        $this->isElementRelated($element, $opinion)->shouldReturn(true);

        // Not related (different id)
        $element->getLinkedDataClass()->willReturn('Capco\AppBundle\Entity\Opinion')->shouldBeCalled();
        $element->getLinkedDataId()->willReturn(51)->shouldBeCalled();
        $this->isElementRelated($element, $opinion)->shouldReturn(false);

        // Not related (different class)
        $element->getLinkedDataClass()->willReturn('Capco\AppBundle\Entity\Synthesis\Test')->shouldBeCalled();
        $element->getLinkedDataId()->willReturn(42)->shouldBeCalled();
        $this->isElementRelated($element, $opinion)->shouldReturn(false);

        // Not related (both different)
        $element->getLinkedDataClass()->willReturn('Capco\AppBundle\Entity\Synthesis\Test')->shouldBeCalled();
        $element->getLinkedDataId()->willReturn(51)->shouldBeCalled();
        $this->isElementRelated($element, $opinion)->shouldReturn(false);
    }

    function it_can_create_elements_from_consultation_step(EntityManager $em, Synthesis $synthesis, ConsultationStep $consultationStep)
    {
        // Objects can not be mocked because we need to call get_class() method on them

        $opinion1 = new Opinion();
        $opinion1->setId(1);

        $argument1 = new Argument();
        $argument1->setId(421);
        $argument1->setOpinion($opinion1);
        $opinion1->addArgument($argument1);

        $argument2 = new Argument();
        $argument2->setId(422);
        $argument2->setOpinion($opinion1);
        $opinion1->addArgument($argument2);

        $opinion2 = new Opinion();
        $opinion2->setId(2);

        $argument3 = new Argument();
        $argument3->setId(423);
        $argument3->setOpinion($opinion2);
        $opinion2->addArgument($argument3);

        $argument4 = new Argument();
        $argument4->setId(424);
        $argument4->setOpinion($opinion2);
        $opinion2->addArgument($argument4);

        // Element 1 is linked to opinion 1
        $element1 = new SynthesisElement();
        $element1->setLinkedDataId(1);
        $element1->setLinkedDataClass('Capco\AppBundle\Entity\Opinion');

        // Element 2 is linked to argument 2
        $element2 = new SynthesisElement();
        $element2->setLinkedDataId(422);
        $element2->setLinkedDataClass('Capco\AppBundle\Entity\Argument');

        // Element 3 is linked to argument 4
        $element3 = new SynthesisElement();
        $element3->setLinkedDataId(424);
        $element3->setLinkedDataClass('Capco\AppBundle\Entity\Argument');

        $currentElements = new ArrayCollection([$element1, $element2, $element3]);
        $opinions = new ArrayCollection([$opinion1, $opinion2]);

        $synthesis->getElements()->willReturn($currentElements)->shouldBeCalled();
        $consultationStep->getOpinions()->willReturn($opinions)->shouldBeCalled();

        $synthesis->addElement(ProphecyArgument::any())->shouldBeCalled();
        $em->persist(ProphecyArgument::any())->shouldBeCalled();

        $em->persist($synthesis)->shouldBeCalled();
        $em->flush()->shouldBeCalled();

        $synthesis = $this->createOrUpdateElementsFromConsultationStep($synthesis, $consultationStep)->shouldReturnAnInstanceOf('Capco\AppBundle\Entity\Synthesis\Synthesis');

        expect(6 === count($synthesis->getElements()));

    }

}
