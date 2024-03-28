describe('getlast Button', () => {
  it('Visit Webpage', () => {
    cy.visit('http://localhost:5173/')  
  cy.get('button').contains('Get last saved time from database').click()
  })
})