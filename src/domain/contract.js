const Sequelize = require("sequelize");
const { sequelize } = require("../infrastructure/database");

class Contract extends Sequelize.Model {
  static associate(models) {
    Contract.hasMany(models.Job);
    Contract.belongsTo(models.Profile, { as: "Contractor" });
    Contract.belongsTo(models.Profile, { as: "Client" });
  }
}
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

module.exports = Contract;
