<?php

namespace Capco\AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * HighlightedEvent.
 *
 * @ORM\Entity()
 */
class HighlightedEvent extends HighlightedContent
{
    /**
     * @ORM\OneToOne(targetEntity="Event")
     */
    private $event;

    /**
     * Gets the value of event.
     *
     * @return mixed
     */
    public function getEvent()
    {
        return $this->event;
    }

    /**
     * Sets the value of event.
     *
     * @param mixed $event the event
     *
     * @return self
     */
    public function setEvent($event)
    {
        $this->event = $event;

        return $this;
    }
}
