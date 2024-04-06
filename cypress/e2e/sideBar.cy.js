describe('Goes through sidebar', () => {
  it('Visit Webpage', () => {
    cy.visit('http://localhost:5173')  
    cy.get('<a>[href $= /personnel]').as('btn').then(
      ($btn) => {
        let coords = $btn[0].getBoundingClientRect();
        cy.get('body').click(coords.x,coords.y)
  })
  })
})