<?php

namespace Capco\AppBundle\Mailer\Message;

use Capco\AppBundle\Utils\Text;

abstract class AbstractMessage
{
    protected $subject;
    protected $subjectVars;

    protected $template;
    protected $templateVars;

    protected $footerTemplate;
    protected $footerTemplateVars;

    protected $recipients;

    protected $senderEmail;
    protected $senderName;

    protected $cc;

    /** Specifies the addresses of recipients who the message will be blind-copied to. Other recipients will not be aware of these copies. */
    protected $bcc;
    protected $replyTo;
    protected $sitename;
    protected $siteUrl;

    public function __construct(
        string $recipientEmail,
        ?string $locale,
        ?string $recipientName,
        string $subject,
        array $subjectVars,
        string $template, // twig or trad key
        array $templateVars,
        ?string $senderEmail = null,
        ?string $senderName = null,
        ?string $replyTo = null,
        ?string $footerTemplate = null, // twig or trad key
        array $footerTemplateVars = []
    ) {
        $this->subject = $subject;
        $this->subjectVars = $subjectVars;
        $this->template = $template;
        $this->templateVars = $templateVars;
        $this->footerTemplate = $footerTemplate;
        $this->footerTemplateVars = $footerTemplateVars;

        $this->replyTo = $replyTo;

        $this->cc = [];
        $this->bcc = [];
        $this->recipients = [];

        $this->senderEmail = $senderEmail;
        $this->senderName = $senderName;

        $this->addRecipient($recipientEmail, $locale, $recipientName, []);
    }

    /**
     * @deprecated use twig template now
     */
    public function getFooterTemplate(): ?string
    {
        return $this->footerTemplate;
    }

    /**
     * @deprecated use twig template now
     */
    public function setFooterTemplate(?string $footerTemplate): self
    {
        $this->footerTemplate = $footerTemplate;

        return $this;
    }

    /**
     * @deprecated use twig template now
     */
    public function getFooterVars(): array
    {
        return $this->footerTemplateVars;
    }

    /**
     * @deprecated use twig template now
     */
    public function setFooterTemplateVars(array $footerTemplateVars): self
    {
        $this->footerTemplateVars = $footerTemplateVars;

        return $this;
    }

    public function getTemplateVars(): array
    {
        return $this->templateVars;
    }

    /*var
     * Inject translation variables to the subject of the email
     */
    final public function getSubjectVars(): array
    {
        return $this->subjectVars;
    }

    final public function getSubject(): string
    {
        return $this->subject;
    }

    final public function getTemplate(): string
    {
        return $this->template;
    }

    public function getReplyTo()
    {
        //: ?string
        return $this->replyTo;
    }

    final public function addRecipient(
        string $recipientEmail,
        ?string $locale = null,
        ?string $recipientName = null,
        array $vars = []
    ) {
        //: void
        $key = mb_strtolower($recipientEmail);

        $this->recipients[$key] = new MessageRecipient(
            $recipientEmail,
            $locale,
            $recipientName,
            $vars
        );
    }

    final public function getRecipients(): array
    {
        return array_values($this->recipients);
    }

    final public function getRecipient($key /*:?MessageRecipient*/)
    {
        if (!\is_int($key) && !\is_string($key)) {
            throw new \InvalidArgumentException('Recipient key must be an integer index or valid email address string.');
        }

        if (\is_string($key) && isset($this->recipients[($key = mb_strtolower($key))])) {
            return $this->recipients[$key];
        }

        $recipients = $this->getRecipients();

        return $recipients[$key] ?? null;
    }

    public function getSenderEmail(): ?string
    {
        return $this->senderEmail;
    }

    public function setSenderEmail(?string $senderEmail): self
    {
        $this->senderEmail = $senderEmail;

        return $this;
    }

    public function getSenderName(): ?string
    {
        return $this->senderName;
    }

    public function setSenderName(?string $senderName): self
    {
        $this->senderName = $senderName;

        return $this;
    }

    public function getCC(): array
    {
        return $this->cc;
    }

    public function addCC(string $cc): void
    {
        $this->cc[] = $cc;
    }

    public function setCC(array $cc): self
    {
        $this->cc = $cc;

        return $this;
    }

    public function getBcc(): array
    {
        return $this->bcc;
    }

    public function addBcc(string $bcc): void
    {
        $this->bcc[] = $bcc;
    }

    public function setBcc(array $bcc): self
    {
        $this->bcc = $bcc;

        return $this;
    }

    public function setReplyTo(?string $replyTo): self
    {
        $this->replyTo = $replyTo;

        return $this;
    }

    public function setSitename(string $value): self
    {
        $this->sitename = $value;

        return $this;
    }

    public function getSitename(): string
    {
        return $this->sitename ? self::escape($this->sitename) : 'Cap Collectif';
    }

    public function setSiteUrl(string $value): self
    {
        $this->siteUrl = $value;

        return $this;
    }

    public function getSiteUrl(): string
    {
        return $this->siteUrl ?? '';
    }

    final public static function escape(string $string): string
    {
        return htmlspecialchars($string, \ENT_NOQUOTES, 'UTF-8', false);
    }

    final protected static function cleanHtml(string $string): string
    {
        return Text::htmlToString($string);
    }
}
