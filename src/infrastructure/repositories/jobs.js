const { Sequelize } = require("sequelize");
const { Contract, Job } = require("../../domain");
const Repository = require("./repository");

class JobsRepository extends Repository {
  constructor() {
    super();
    this.model = Job;
  }

  async getAllUnpaid(userId) {
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