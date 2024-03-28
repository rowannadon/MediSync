describe('socket Button', () => {
  it('Visit Webpage', () => {
    cy.visit('http://localhost:5173/')  
  cy.get('button').contains('Get socket.io Response').click()
  })
})