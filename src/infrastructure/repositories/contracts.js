const { Sequelize } = require("sequelize");
const { Contract } = require("../../domain");
const Repository = require("./repository");

class ContractsRepository extends Repository {
  constructor() {
    super();
    this.model = Contract;
  }

  async get(id) {
    return await this.model.findByPk(id);
  }

  async getAll(userId) {
    return await this.model.findAll({
      where: {
        [Sequelize.Op.or]: [
          { ClientId: userId },
          { ContractorId: userId },
        ],
        status: {
          [Sequelize.Op.ne]: "terminated",
        },
      },
    });
  }
}

module.exports = ContractsRepository;