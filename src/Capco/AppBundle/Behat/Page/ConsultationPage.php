<?php

namespace Capco\AppBundle\Behat\Page;

use Capco\AppBundle\Behat\PageTrait;
use SensioLabs\Behat\PageObjectExtension\PageObject\Page;
use SensioLabs\Behat\PageObjectExtension\PageObject\Exception\UnexpectedPageException;

class ConsultationPage extends Page
{
    use PageTrait;

    /**
     * @var string
     */
    protected $path = '/consultations/{consultationSlug}/consultation/{stepSlug}';

    protected $elements = array(
        'Opinion nav bar' => '.consultation__nav',
        'Opinion nav item' => array(
            'css' => '.consultation__nav li',
        ),
    );

    protected function verifyUrl(array $urlParameters = array())
    {
        $expectedUrl = $this->getUrl($urlParameters);
        $currentUrl = $this->getSession()->getCurrentUrl();
        $opinionTypeUrl = $expectedUrl.'/opinions/';

        if ($currentUrl !== $expectedUrl) {
            if (false === strrpos($currentUrl, $opinionTypeUrl)) {
                throw new UnexpectedPageException(
                    sprintf(
                        'Expected to be on "%s" but found "%s" instead',
                        $this->getUrl($urlParameters),
                        $this->getSession()->getCurrentUrl()
                ));
            }
        }
    }


}
