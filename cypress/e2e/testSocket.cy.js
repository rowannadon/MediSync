describe('socket Button', () => {
  it('Visit Webpage', () => {
    cy.visit('http://localhost:5173/test')  
  cy.get('button').contains('Get socket.io Response').click()
  cy.get('p[id="socket.io-response"]').contains('socket.io response: This is a response from the server!')
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })
  })
})