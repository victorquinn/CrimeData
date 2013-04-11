/*
 * Configuration
 */

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGOLAB_URI || 'mongodb://localhost/sfcrimedata'
};