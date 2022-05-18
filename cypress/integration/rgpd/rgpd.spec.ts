describe('rgpd', () => {
  it('should toggle cookies performance', () => {
    cy.visit(`/`)
    cy.get('#cookies-management').click()
    cy.contains('global.disabled')
    cy.get('#cookies-enable-analytic').click({ force: true })
    cy.contains('list.label_enabled')
    cy.get('#cookies-save').click({ force: true })
    cy.contains('cookies.content.page').should('not.be.visible')
    cy.getCookie('analyticConsentValue').should('have.property', 'value', 'true')
  })
  it('should toggle cookies advertising', () => {
    cy.visit(`/`)
    cy.get('#cookies-management').click()
    cy.contains('global.disabled')
    cy.get('#cookies-enable-ads').click({ force: true })
    cy.contains('list.label_enabled')
    cy.get('#cookies-save').click({ force: true })
    cy.contains('cookies.content.page').should('not.be.visible')
    cy.getCookie('adCookieConsentValue').should('have.property', 'value', 'true')
  })
})
