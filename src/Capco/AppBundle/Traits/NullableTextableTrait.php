<?php

namespace Capco\AppBundle\Traits;

use Capco\AppBundle\Utils\Text;
use Doctrine\ORM\Mapping as ORM;

trait NullableTextableTrait
{
    /**
     * @ORM\Column(name="body", type="text", nullable=true)
     */
    private $body;

    public function getBody(): ?string
    {
        return $this->body;
    }

    public function getBodyText()
    {
        return strip_tags($this->body);
    }

    public function setBody(?string $body = null): self
    {
        $this->body = $body;

        return $this;
    }

    public function getBodyExcerpt(int $nb = 100): string
    {
        $excerpt = substr($this->body, 0, $nb);
        $excerpt .= '…';

        return $excerpt;
    }

    public function getBodyTextExcerpt(int $nb = 100): string
    {
        $text = Text::htmlToString($this->body);

        if (\strlen($text) > $nb) {
            $text = substr($text, 0, $nb);
            $text .= '[…]';
        }

        return Text::htmlToString($text);
    }
}
