describe('Tests View of Home Screen', () => {
   it('Visit Webpage', () => {
    cy.wait(5000)
    cy.login('test3','test3')
    cy.wait(1000)  
    cy.visit('http://localhost:5173/tasks')  
    cy.get('div').contains('No tasks scheduled...')
  })
})