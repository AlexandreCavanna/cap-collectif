<?php

namespace Capco\AppBundle\Behat\Page;

use Capco\AppBundle\Behat\PageTrait;
use Capco\AppBundle\Behat\Traits\AdminProposalFormTrait;
use SensioLabs\Behat\PageObjectExtension\PageObject\Page;

class AdminProposalFormPage extends Page
{
    use AdminProposalFormTrait;
    use PageTrait;

    protected $path = 'admin/capco/app/proposalform/{id}/edit';

    protected $elements = [
        'link tab configuration' => '#link-tab-configuration',
        'link tab analysis' => '#link-tab-analysis',
        'link tab new analysis' => '#link-tab-new-analysis',
        'link tab notification' => '#link-tab-notification',
        'link tab settings' => '#link-tab-settings',
        'proposal form introduction' => '#ql-editor-1 div',
        'proposal form title help' => '#proposal_form_title_help_text',
        'proposal form summary help' => '#proposal_form_summary_help_text',
        'proposal form description help' => '#proposal_form_description_help_text',
        'proposal form illustration help' => '#proposal_form_illustration_help_text',
        'proposal form address toggle' => '#address .form-group .elegant-toggle',
        'proposal form description toggle' => '#description .form-group .elegant-toggle',
        'proposal form summary toggle' => '#summary .form-group .elegant-toggle',
        'proposal form illustration toggle' => '#illustration .form-group .elegant-toggle',
        'proposal form address limit' => '#proposal_form_district_proposalInAZoneRequired',
        'proposal form address zoom' => '#proposal_form_zoom_map',
        'proposal form category mandatory' => '#proposal_form_category_mandatory',
        'proposal form category mandatory help' => '#proposal_form_category_help_text',
        'proposal form category add' => '#proposal_form_admin_category_panel_body .form-group button',
        'proposal form category add popup title' => '#categories[0].name',
        'proposal form category add popup save' => '#ProposalFormAdminCategoriesStepModal-submit',
        'proposal form personal-field add' => '#js-btn-create-question',
        'proposal form personal-field add popup required' => 'input[name="questions[0]\.required"]',
        'proposal form personal-field add popup private' => 'input[name="questions[0]\.private"]',
        'proposal form personal-field add popup save' => '.modal-content .btn-primary',
        'proposal form notification proposition modified' => '#proposal_form_notification_on_update',
        'proposal form notification commentary created' => '#proposal_form_notification_comment_on_create',
        'proposal form evaluation question' => '#evaluation-form',
        'proposal form parameters commentable' => '#proposal_form_commentable',
        'proposal form parameters costable' => '#proposal_form_costable',
        'proposal form content save' => '#proposal-form-admin-content-save',
        'proposal form evaluation save' => '#evaluation-submit',
        'proposal form notification save' => '#notification-submit',
        'proposal form parameters save' => '#parameters-submit',
        'proposal form address selection' => '#proposal_form_using_address_field',
        'proposal form personal-section add' => '#js-btn-create-section',
        'proposal form first question delete' => '#js-btn-delete-0',
        'proposal form delete modale button' => '#js-delete-question',
    ];

    public function clickSaveProposalFormButton(string $tab)
    {
        $this->getElement('proposal form ' . $tab . ' save')->click();
    }

    public function clickSaveProposalFormAdressButton()
    {
        $this->getElement('proposal form address selection')->click();
    }

    public function clickOnTab(string $tab)
    {
        switch ($tab) {
            case 'configuration':
                $this->getElement('link tab configuration')->click();

                break;

            case 'analysis':
                $this->getElement('link tab analysis')->click();

                break;

            case 'new-analysis':
                $this->getElement('link tab new analysis')->click();

                break;

            case 'notification':
                $this->getElement('link tab notification')->click();

                break;

            case 'settings':
                $this->getElement('link tab settings')->click();

                break;

            default:
                return;
        }
    }

    public function selectProposalFormDropDown(string $status, string $element)
    {
        return $this->getElement($element)->selectOption($status);
    }

    public function fillElementWithValue(string $element, string $value)
    {
        $this->getElement($element)->setValue($value);
    }

    public function clickOnButtonOrRadio(string $element)
    {
        $this->getElement($element)->click();
    }

    /**
     * Overload to verify if we're on an expected page. Throw an exception otherwise.
     */
    public function verifyPage()
    {
        if (!$this->getSession()->wait(10000, "$('.admin_proposal_form').length > 0")) {
            throw new \RuntimeException('AdminProposalFormPage did not fully load, check selector in "verifyPage".');
        }
    }
}
