describe('API Button', () => {
  it('Visit Webpage', () => {
    cy.visit('http://localhost:5173/test')  
    cy.get('Button').contains('Get API Response').click()
    cy.get('p[id="api-response"]').contains('API response: This is a response from the server!')
  })
})