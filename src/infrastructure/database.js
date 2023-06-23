const { Sequelize } = require('sequelize');
const { loadEnvironmentVariables } = require('./config/setup');

loadEnvironmentVariables();
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_FILE || './database.sqlite3',
  logging: () => process.env.DB_LOGGING,
});

module.exports = {
  sequelize,
};