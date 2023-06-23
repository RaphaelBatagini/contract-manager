const Sequelize = require("sequelize");
const { sequelize } = require("../infrastructure/database");

class Profile extends Sequelize.Model {
  static associate(models) {
    Profile.hasMany(models.Contract, { as: "Client", foreignKey: "ClientId" });
    Profile.hasMany(models.Contract, {
      as: "Contractor",
      foreignKey: "ContractorId",
    });
  }
}
Profile.init(
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profession: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    balance: {
      type: Sequelize.DECIMAL(12, 2),
    },
    type: {
      type: Sequelize.ENUM("client", "contractor"),
    },
  },
  {
    sequelize,
    modelName: "Profile",
  }
);

module.exports = Profile;