const Sequelize = require("sequelize");
const { sequelize } = require("../infrastructure/database");

class Job extends Sequelize.Model {
  static associate(models) {
    Job.belongsTo(models.Contract);
  }
}
Job.init(
  {
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    price:{
      type: Sequelize.DECIMAL(12,2),
      allowNull: false
    },
    paid: {
      type: Sequelize.BOOLEAN,
      default:false
    },
    paymentDate:{
      type: Sequelize.DATE
    }
  },
  {
    sequelize,
    modelName: 'Job'
  }
);

module.exports = Job;