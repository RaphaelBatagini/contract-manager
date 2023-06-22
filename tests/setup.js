const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './test_database.sqlite3', // Specify a separate database file for testing
});

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Drops existing tables and recreates them
});

afterAll(async () => {
  await sequelize.close();
});

module.exports = sequelize;