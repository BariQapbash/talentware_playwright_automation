// Load environment variables from .env file before running tests
require('dotenv').config();

module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['tsx'],
    require: ['src/steps/**/*.ts'],
    format: ['progress-bar', 'html:test-results/cucumber-report.html'],
  },
};