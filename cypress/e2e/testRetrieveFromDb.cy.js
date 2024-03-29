describe('getlast Button', () => {
  it('Visit Webpage', () => {
    cy.visit('http://localhost:5173/')  
    cy.get('button').contains('Get saved times from database').click()
    cy.get('button').contains('Write current time to database').click()
    // get text of p element with id "current-time"
    const time = cy.get('p[id="current-time"]').invoke('text');
    console.log(time);
    cy.contains('p', time, { matchCase: false }).should('exist');
  })
})