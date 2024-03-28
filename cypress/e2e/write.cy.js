describe('write Button', () => {
  it('Visit Webpage', () => {
    cy.visit('http://localhost:5173/')  
  cy.get('button').contains('Write current time to database').click()
  })
})