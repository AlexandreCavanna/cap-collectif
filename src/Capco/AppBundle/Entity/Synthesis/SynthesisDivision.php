<?php

namespace Capco\AppBundle\Entity\Synthesis;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation as Serializer;

/**
 * SynthesisDivision.
 *
 * @ORM\Table(name="synthesis_division")
 * @ORM\Entity()
 * @Gedmo\Loggable()
 * @Serializer\ExclusionPolicy("all")
 */
class SynthesisDivision
{
    /**
     * @var int
     *
     * @ORM\Id
     * @ORM\Column(name="id", type="guid")
     * @ORM\GeneratedValue(strategy="UUID")
     * @Serializer\Expose
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Capco\AppBundle\Entity\Synthesis\SynthesisElement", cascade={"persist"})
     * @ORM\JoinColumn(name="original_element_id", referencedColumnName="id")
     * @Serializer\Expose
     * @Gedmo\Versioned
     */
    private $originalElement;

    /**
     * @Serializer\Type("ArrayCollection<Capco\AppBundle\Entity\Synthesis\SynthesisElement>")
     * @ORM\OneToMany(targetEntity="Capco\AppBundle\Entity\Synthesis\SynthesisElement", mappedBy="originalDivision", cascade={"persist"})
     * @Serializer\Expose
     */
    private $elements;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getOriginalElement()
    {
        return $this->originalElement;
    }

    /**
     * @param mixed $originalElement
     */
    public function setOriginalElement($originalElement)
    {
        $this->originalElement = $originalElement;
    }

    /**
     * @return mixed
     */
    public function getElements()
    {
        return $this->elements;
    }

    /**
     * @return mixed
     */
    public function addElement(SynthesisElement $element)
    {
        return $this->elements[] = $element;
        $element->setOriginalDivision($this);
    }

    /**
     * @return mixed
     */
    public function removeElement(SynthesisElement $element)
    {
        return $this->elements->removeElement($element);
        $element->setOriginalDivision(null);
    }

    /**
     * @param mixed $elements
     */
    public function setElements($elements)
    {
        $this->elements = $elements;
        foreach ($elements as $el) {
            $el->setOriginalDivision($this);
        }
    }
}
