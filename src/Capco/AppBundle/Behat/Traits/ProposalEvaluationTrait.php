<?php

namespace Capco\AppBundle\Behat\Traits;

/**
 * @deprecated this is our legacy evaluation tool
 */
trait ProposalEvaluationTrait
{
    /**
     * @When I go to the evaluations page
     */
    public function iGoToTheEvaluationsPage()
    {
        $this->iVisitedPage('evaluations page');
        $this->waitAndThrowOnFailure(
            5000,
            "document.body.innerHTML.toString().indexOf('Ravalement de la façade de la bibliothèque municipale') > -1"
        );
    }

    /**
     * @Then there should be :nb evaluations
     */
    public function thereShouldBeNbEvals(int $nb)
    {
        $this->assertPageContainsText('count-proposal {"num":' . $nb . '}');
    }
}
