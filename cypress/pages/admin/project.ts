export default new (class AdminProjectPage {
  get cy() {
    return cy
  }

  path(projectName: string) {
    return `admin/alpha/project/${projectName}/edit`
  }

  visit(projectName: string) {
    return this.cy.visit(this.path(projectName))
  }

  visitContributionsPage({ projectSlug, state, stepId }: { projectSlug: string; state: string; stepId: string }) {
    const url = `admin/alpha/project/${projectSlug}/contributions/proposals?state=${state}&step=${stepId}`
    this.cy.visit(url)
    this.cy.interceptGraphQLOperation({ operationName: 'ProjectAdminParticipantTabQuery' })
    this.cy.interceptGraphQLOperation({ operationName: 'ProjectAdminProposalsPageQuery' })
    this.cy.interceptGraphQLOperation({ operationName: 'ProjectAdminContributionsPageQuery' })
    this.cy.interceptGraphQLOperation({ operationName: 'ProjectAdminAnalysisTabQuery' })
    this.cy.interceptGraphQLOperation({ operationName: 'ProjectAdminProposalsPageQuery' })
    this.cy.wait('@ProjectAdminParticipantTabQuery')
    this.cy.wait('@ProjectAdminProposalsPageQuery')
    this.cy.wait('@ProjectAdminContributionsPageQuery')
    this.cy.wait('@ProjectAdminAnalysisTabQuery')
    this.cy.wait('@ProjectAdminProposalsPageQuery')
  }

  openAddModal() {
    this.addButton.click()
  }

  get addButton() {
    return this.cy.contains('global.add')
  }

  get collectStepSelector() {
    return this.cy.get('#collect_step')
  }

  get selectionStepSelector() {
    return this.cy.get('#selection_step')
  }

  toggleVote() {
    this.cy.get("label[for='step-votable'] span.circle-toggler").click()
  }

  toggleSecretBallot() {
    this.cy.get("label[for='step-secretBallot'] span.circle-toggler").click()
  }

  get questionnaireSelector() {
    return this.cy.contains('global.questionnaire')
  }

  fillStepInputs(title: string, label: string) {
    this.stepTitleInput.type(title)
    this.stepLabelInput.type(label)
  }

  get stepLabelInput() {
    return this.cy.get('#step-label')
  }

  get stepTitleInput() {
    return this.cy.get('#step-title')
  }

  submitStepModal() {
    this.stepModalSubmitButton.click()
  }

  get stepModalSubmitButton() {
    return this.cy.get('#step-modal-submit')
  }

  checkStepListLength(expectedLength: number) {
    this.stepList.should('have.length', expectedLength)
  }

  get stepList() {
    return this.cy.get('.list-group > div > div')
  }

  save() {
    this.saveButton.click()
  }

  get saveButton() {
    return this.cy.contains('global.save')
  }
})()
