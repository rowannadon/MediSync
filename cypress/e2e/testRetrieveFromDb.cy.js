describe('getlast Button', () => {
  it('Visit Webpage', () => {
    cy.login('test3','test3')
    cy.wait(1000)
    cy.visit('http://localhost:5173/test')
    cy.get('button').contains('Get saved times from database').click()
    cy.get('button').contains('Write current time to database').click()
    // get text of p element with id "current-time"
    cy.get('p[id="current-time"]').then((items) => {
      cy.log(items[0].textContent)
      cy.get('p[class="time"]').then((items) => {
        const list = Array.from(items, (item) => item.textContent)
        expect(list).to.include(items[0].textContent)
      })
    });
    
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
  })
})