const Sequelize = require("sequelize");
const Profile = require("./profile");
const Job = require("./job");
const { sequelize } = require("../infrastructure/database");

class Contract extends Sequelize.Model {}
Contract.init(
  {
    terms: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("new", "in_progress", "terminated"),
    },
  },
  {
    sequelize,
    modelName: "Contract",
  }
);

Contract.hasMany(Job);

module.exports = Contract;
