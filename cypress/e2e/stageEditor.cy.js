describe('Tests Creating a Stage Template', () => {
   it('Visit Webpage', () => {
    cy.login('test3','test3')  
    cy.wait(1000)  
    cy.visit('http://localhost:5173/stage-editor')  
    cy.get('[data-cy="NewStageButton"]').click()
    // cy.get('[data-cy="NewStageFormTitle"]').click().type('{selectAll}Test')
    cy.get('[data-cy="NewStageForm"]').within(($form) => {
      cy.get('[data-cy="NewStageFormTitle"]').click().type('{selectAll}Test')
      cy.get('button').contains("diagnostic").click({force:true})
      cy.contains('pre-operative').parent().select('pre-operative',{force:true})
      cy.get('button').contains("Save Changes").click({force:true})
    })

    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
  })
})