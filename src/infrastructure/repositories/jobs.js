const { Sequelize } = require("sequelize");
const { Contract, Job } = require("../../domain");

class JobsRepository {
  constructor() {
    this.model = Job;
  }

  async get(id) {
    return await this.model.findByPk(id);
  }

  async getUnpaid(userId) {
    return await this.model.findAll({
      where: {
        [Sequelize.Op.or]: [{ paid: false }, { paid: null }],
      },
      include: [
        {
          model: Contract,
          where: {
            status: {
              [Sequelize.Op.ne]: "terminated",
            },
            [Sequelize.Op.or]: [
              { ClientId: userId },
              { ContractorId: userId },
            ],
          },
        },
      ],
    });
  }
}

module.exports = JobsRepository;