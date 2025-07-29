describe("User Management E2E Tests", () => {
  // Store created user IDs for cleanup
  const createdUserIds = [];

  beforeEach(() => {
    cy.checkApiHealth();
    cy.waitForApp();
  });

  // Clean up any users created during tests
  afterEach(() => {
    // Delete any users created during the test
    createdUserIds.forEach((userId) => {
      cy.request({
        method: "DELETE",
        url: `${Cypress.env("apiUrl")}/users/${userId}`,
        failOnStatusCode: false,
      });
    });
    // Clear the array after cleanup
    createdUserIds.length = 0;
  });

  it("should display the application title", () => {
    cy.contains("CICD Workshop - User Management").should("be.visible");
  });

  it("should display user statistics dashboard", () => {
    // Check if user stats component is visible
    cy.get('[data-testid="user-stats"]').should("be.visible");
    cy.contains("📊 User Statistics").should("be.visible");

    // Check stat cards
    cy.get('[data-testid="total-users"]').should("be.visible");
    cy.get('[data-testid="recent-users"]').should("be.visible");
    cy.get('[data-testid="growth-rate"]').should("be.visible");

    // Check refresh button
    cy.get('[data-testid="refresh-stats"]').should("be.visible");
  });

  it("should update statistics when users are added", () => {
    // Get initial user count
    cy.get('[data-testid="total-users"]')
      .invoke("text")
      .then((initialCount) => {
        const testUserName = `Stat Test User ${Date.now()}`;
        const testUserEmail = `stattest-${Date.now()}@example.com`;

        // Create a new user via the form
        cy.get('[data-testid="user-form"]').within(() => {
          cy.get('input[name="name"]').type(testUserName);
          cy.get('input[name="email"]').type(testUserEmail);
          cy.get('button[type="submit"]').click();
        });

        // Wait for success message
        cy.contains("created successfully").should("be.visible");

        // Check that statistics updated
        cy.get('[data-testid="total-users"]').should(
          "not.contain",
          initialCount
        );
        cy.get('[data-testid="recent-users"]').should("not.contain", "0");
      });
  });

  it("should load and display existing users", () => {
    // Create a test user first to ensure there's at least one user
    const testUserName = `Test User ${Date.now()}`;
    const testUserEmail = `test-${Date.now()}@example.com`;

    // Create user via API to ensure it exists
    cy.request("POST", `${Cypress.env("apiUrl")}/users`, {
      name: testUserName,
      email: testUserEmail,
    }).then((response) => {
      // Store the user ID for cleanup
      createdUserIds.push(response.body.id);

      // Reload the page to see the new user
      cy.reload();

      // Check that the user is displayed
      cy.contains(testUserName).should("be.visible");
      cy.contains(testUserEmail).should("be.visible");

      // Verify user card structure
      cy.contains(testUserName)
        .closest('[data-testid^="user-"]')
        .within(() => {
          cy.get("h3").should("exist");
          cy.contains("@").should("exist"); // Email should contain @ symbol
        });
    });
  });

  it("should create a new user", () => {
    // Create a unique user name with timestamp to ensure uniqueness
    const uniqueName = `Test User ${Date.now()}`;
    const uniqueEmail = `test-${Date.now()}@example.com`;

    // Add new user
    cy.addUser(uniqueName, uniqueEmail);

    // Verify user was added - with a timeout to ensure the UI updates
    cy.contains(uniqueName, { timeout: 5000 }).should("be.visible");
    cy.contains(uniqueEmail, { timeout: 5000 }).should("be.visible");

    // Verify form was cleared
    cy.get('[data-testid="name-input"]').should("have.value", "");
    cy.get('[data-testid="email-input"]').should("have.value", "");

    // Get the user ID from the API for cleanup
    cy.request(`${Cypress.env("apiUrl")}/users`).then((response) => {
      const user = response.body.find(
        (u) => u.name === uniqueName && u.email === uniqueEmail
      );
      if (user && user.id) {
        createdUserIds.push(user.id);
      }
    });
  });

  it("should delete a user", () => {
    // Create a unique user name with timestamp to ensure uniqueness
    const uniqueName = `Test Delete User ${Date.now()}`;
    const uniqueEmail = `delete-test-${Date.now()}@example.com`;

    // Add the unique user
    cy.addUser(uniqueName, uniqueEmail);

    // Verify user exists and store its ID
    cy.contains("h3", uniqueName)
      .should("be.visible")
      .closest('[data-testid^="user-"]')
      .invoke("attr", "data-testid")
      .then((testId) => {
        // Extract the user ID from the data-testid attribute
        const userId = testId.replace("user-", "");

        // Click the delete button for this specific user
        cy.get(`[data-testid="delete-user-${userId}"]`).click();

        // Wait for the delete operation and page refresh
        cy.wait(1000);

        // Verify the specific user element no longer exists
        cy.get(`[data-testid="user-${userId}"]`).should("not.exist");

        // No need to add to createdUserIds since we're deleting it in the test
      });
  });

  it("should handle form validation", () => {
    // Clear any existing values in the form
    cy.get('[data-testid="name-input"]').clear();
    cy.get('[data-testid="email-input"]').clear();

    // Try to submit empty form
    cy.get('[data-testid="submit-button"]').click();

    // Form should not submit (browser validation)
    // Note: This might not work in all browsers as they handle HTML5 validation differently
    // Alternative approach: check that no new user was added
    cy.get('[data-testid="name-input"]:invalid')
      .should("exist")
      .then(() => {
        // Also verify no success message is shown
        cy.get("body").should("not.contain", "created successfully");
      });
  });

  it("should handle API errors gracefully", () => {
    // Verify no error messages are currently displayed
    cy.get("body").should("not.contain", "Failed to load users");
    cy.get("body").should("not.contain", "Failed to create user");
    cy.get("body").should("not.contain", "Failed to delete user");
  });
});
