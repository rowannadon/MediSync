describe('write Button', () => {
  it('Visit Webpage', () => {
    cy.login('test','test')  
    cy.visit('http://localhost:5173/test')  
  cy.get('button').contains('Write current time to database').click()
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })
  })
})