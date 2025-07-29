describe("User Statistics Feature E2E Tests", () => {
  const createdUserIds = [];

  beforeEach(() => {
    cy.checkApiHealth();
    cy.waitForApp();
  });

  afterEach(() => {
    // Cleanup created users
    createdUserIds.forEach((userId) => {
      cy.request({
        method: "DELETE",
        url: `${Cypress.env("apiUrl")}/users/${userId}`,
        failOnStatusCode: false,
      });
    });
    createdUserIds.length = 0;
  });

  it("should display user statistics dashboard with correct data", () => {
    // Verify stats dashboard is visible
    cy.get('[data-testid="user-stats"]').should("be.visible");
    cy.contains("📊 User Statistics").should("be.visible");

    // Verify all stat cards are present
    cy.get('[data-testid="total-users"]').should("be.visible");
    cy.get('[data-testid="recent-users"]').should("be.visible");
    cy.get('[data-testid="growth-rate"]').should("be.visible");

    // Create a test user to verify stats update
    const testUser = {
      name: `Stats Test User ${Date.now()}`,
      email: `statstest${Date.now()}@example.com`,
    };

    // Get initial counts
    cy.get('[data-testid="total-users"]').invoke("text").as("initialTotal");
    cy.get('[data-testid="recent-users"]').invoke("text").as("initialRecent");

    // Create user via form
    cy.get('[data-testid="user-form"]').within(() => {
      cy.get('input[name="name"]').type(testUser.name);
      cy.get('input[name="email"]').type(testUser.email);
      cy.get('button[type="submit"]').click();
    });

    // Wait for success message
    cy.contains("created successfully", { timeout: 10000 }).should(
      "be.visible"
    );

    // Verify stats updated
    cy.get("@initialTotal").then((initialTotal) => {
      const expectedTotal = parseInt(initialTotal) + 1;
      cy.get('[data-testid="total-users"]').should(
        "contain",
        expectedTotal.toString()
      );
    });

    cy.get("@initialRecent").then((initialRecent) => {
      const expectedRecent = parseInt(initialRecent) + 1;
      cy.get('[data-testid="recent-users"]').should(
        "contain",
        expectedRecent.toString()
      );
    });

    // Verify domain stats appear if there are users with emails
    cy.get('[data-testid="domain-stats"]').should("be.visible");
    cy.contains("example.com").should("be.visible");
  });

  it("should handle refresh functionality", () => {
    // Click refresh button
    cy.get('[data-testid="refresh-stats"]').click();

    // Verify page reloaded (app should be visible again)
    cy.contains("CICD Workshop - User Management").should("be.visible");
    cy.get('[data-testid="user-stats"]').should("be.visible");
  });

  it("should display responsive stats grid layout", () => {
    // Verify stats grid is responsive
    cy.get(".stats-grid").should("be.visible");

    // Check that stat cards have proper styling
    cy.get(".stat-card").should("have.length.at.least", 3);
    cy.get(".stat-card").each(($card) => {
      cy.wrap($card).should(
        "have.css",
        "background-color",
        "rgb(248, 249, 250)"
      );
      cy.wrap($card).should("have.css", "border-radius", "8px");
    });
  });

  it("should calculate growth rate correctly", () => {
    // Clear existing users for accurate calculation
    cy.request("GET", `${Cypress.env("apiUrl")}/users`).then((response) => {
      const existingUsers = response.body;

      // Delete existing users for clean test
      existingUsers.forEach((user) => {
        cy.request("DELETE", `${Cypress.env("apiUrl")}/users/${user.id}`);
      });

      // Create multiple users with different timestamps
      const users = [
        {
          name: "Old User",
          email: "old@test.com",
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        },
        {
          name: "Recent User 1",
          email: "recent1@test.com",
          createdAt: new Date(),
        },
        {
          name: "Recent User 2",
          email: "recent2@test.com",
          createdAt: new Date(),
        },
      ];

      users.forEach((user) => {
        cy.request("POST", `${Cypress.env("apiUrl")}/users`, user).then(
          (response) => {
            createdUserIds.push(response.body.id);
          }
        );
      });

      // Reload page to get updated stats
      cy.reload();
      cy.waitForApp();

      // Verify calculations
      cy.get('[data-testid="total-users"]').should("contain", "3");
      cy.get('[data-testid="recent-users"]').should("contain", "2");
      cy.get('[data-testid="growth-rate"]').should("contain", "67%");
    });
  });

  it("should display domain statistics correctly", () => {
    // Create users with different email domains
    const testUsers = [
      { name: "User 1", email: "user1@gmail.com" },
      { name: "User 2", email: "user2@gmail.com" },
      { name: "User 3", email: "user3@yahoo.com" },
    ];

    testUsers.forEach((user) => {
      cy.request("POST", `${Cypress.env("apiUrl")}/users`, user).then(
        (response) => {
          createdUserIds.push(response.body.id);
        }
      );
    });

    // Reload to see updated domain stats
    cy.reload();
    cy.waitForApp();

    // Verify domain statistics
    cy.get('[data-testid="domain-stats"]').should("be.visible");
    cy.contains("gmail.com").should("be.visible");
    cy.contains("yahoo.com").should("be.visible");

    // Check counts (gmail.com should have 2, yahoo.com should have 1)
    cy.get('[data-testid="domain-stats"]').within(() => {
      cy.contains("gmail.com").parent().should("contain", "2");
      cy.contains("yahoo.com").parent().should("contain", "1");
    });
  });

  it("should handle empty state gracefully", () => {
    // Clear all users
    cy.request("GET", `${Cypress.env("apiUrl")}/users`).then((response) => {
      const users = response.body;
      users.forEach((user) => {
        cy.request("DELETE", `${Cypress.env("apiUrl")}/users/${user.id}`);
      });

      // Reload page
      cy.reload();
      cy.waitForApp();

      // Verify empty state
      cy.get('[data-testid="total-users"]').should("contain", "0");
      cy.get('[data-testid="recent-users"]').should("contain", "0");
      cy.get('[data-testid="growth-rate"]').should("contain", "0%");

      // Domain stats should not be visible
      cy.get('[data-testid="domain-stats"]').should("not.exist");
    });
  });
});
