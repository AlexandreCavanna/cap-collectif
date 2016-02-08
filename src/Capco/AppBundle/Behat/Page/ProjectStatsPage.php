<?php

namespace Capco\AppBundle\Behat\Page;

use Capco\AppBundle\Behat\PageTrait;
use SensioLabs\Behat\PageObjectExtension\PageObject\Page;

class ProjectStatsPage extends Page
{
    use PageTrait;

    /**
     * @var string
     */
    protected $path = '/projects/{projectSlug}/stats';

    public $elements = [
        'theme stats items' => '#stats-21-themes .stats__list__row',
        'district stats items' => '#stats-21-districts .stats__list__row',
        'district stats modal items' => '#stats-modal-21-districts .stats__list__row',
        'district stats show more button' => '#stats-21-districts .stats__all-button',
        'user type stats items' => '#stats-21-userTypes .stats__list__row',
        'costs stats items' => '#stats-21-costs .stats__list__row',
        'votes stats items' => '#stats-9-votes .stats__list__row',
        'theme filter select' => '#stats-9-votes .stats__filter--themes',
        'district filter select' => '#stats-9-votes .stats__filter--districts',
    ];

    public function getThemeStatsItemsSelector()
    {
        return $this->getSelector('theme stats items');
    }

    public function getDistrictStatsItemsSelector()
    {
        return $this->getSelector('district stats items');
    }

    public function getUserTypeStatsItemsSelector()
    {
        return $this->getSelector('user type stats items');
    }

    public function getCostsStatsItemsSelector()
    {
        return $this->getSelector('costs stats items');
    }

    public function getVotesStatsItemsSelector()
    {
        return $this->getSelector('votes stats items');
    }

    public function showAllDistrictStats()
    {
        $this->getElement('district stats show more button')->click();
    }

    public function getDistrictStatsModalItemsSelector()
    {
        return $this->getSelector('district stats modal items');
    }

    public function filterByTheme()
    {
        return $this->getElement('theme filter select')->selectOption('Justice');
    }

    public function filterByDistrict()
    {
        return $this->getElement('district filter select')->selectOption('Beauregard');
    }
}
