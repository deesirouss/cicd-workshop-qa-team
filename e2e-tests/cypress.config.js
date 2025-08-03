const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://t1.cicdws.bibek-mishra.com.np',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    env: {
      apiUrl: process.env.API_URL || 'https://t1-api.cicdws.bibek-mishra.com.np/api/health', // Optional
    },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      configFile: 'reporter-config.json',
    },
  },
  setupNodeEvents(on, config) {
    require('cypress-mochawesome-reporter/plugin')(on);
  },
});
