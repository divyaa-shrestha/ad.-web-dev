describe('App E2E Test', () => {
  it('should load the app and display the heading', () => {
    // Visit the app's URL
    cy.visit('http://localhost:3000');

    // Check if the heading is displayed
    cy.contains('Database Test').should('be.visible');
  });
});