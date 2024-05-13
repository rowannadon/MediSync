describe('write Button', () => {
  it('Visit Webpage', () => {
    cy.login('test3','test3')  
    cy.wait(1000)  
    cy.visit('http://localhost:5173/test')  
  cy.get('button').contains('Write current time to database').click()
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })
  })
})