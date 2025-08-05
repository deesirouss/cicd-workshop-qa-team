describe("Backend Health Check", () => {
  it("should verify backend is accessible before running full tests", () => {
    const apiUrl =
      Cypress.env("apiUrl") || "https://t6-api.cicdws.bibek-mishra.com.np/api";

    cy.request({
      method: "GET",
      url: `${apiUrl}/health`,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status !== 200) {
        cy.log(`❌ Backend is not healthy: ${response.status}`);
        cy.log(`Response: ${JSON.stringify(response.body)}`);
        throw new Error(
          `Backend health check failed with status ${response.status}`
        );
      }

      cy.log("✅ Backend is healthy!");
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("status", "OK");
    });
  });
});
