describe('Tests View of Home Screen', () => {
   it('Visit Webpage', () => {
    cy.login('test','test')
    cy.wait(1000)  
    cy.visit('http://localhost:5173/tasks')  
    cy.get('button').contains('Next slide').click({ force: true })
    cy.get('div').contains('Details: X-Ray: Left Elbow')
    cy.get('button').contains('Previous slide').click({ force: true })
    cy.get('div').contains('Details: Basic checkup')
  })
})