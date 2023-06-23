const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.ENVIROMENT === 'test' ? './test_database.sqlite3' : './database.sqlite3',
  logging: process.env.DB_LOGGING || false,
});

module.exports = {
  sequelize,
};