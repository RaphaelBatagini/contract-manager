const { Sequelize } = require("sequelize");
const { Contract, Job, Profile } = require("../../domain");
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

  getProfessionsIncome(start, end, limit = 1) {
    return this.model.findAll({
      attributes: [
        [
          Sequelize.literal("`Contract->Contractor`.profession"),
          "profession",
        ],
        [Sequelize.fn("sum", Sequelize.col("price")), "totalEarned"],
      ],
      include: [
        {
          model: Contract,
          as: "Contract",
          include: [
            {
              model: Profile,
              as: "Contractor",
              where: {
                profession: { [Sequelize.Op.not]: null },
                type: "contractor",
              },
            },
          ],
        },
      ],
      where: {
        paid: true,
        paymentDate: {
          [Sequelize.Op.between]: [new Date(start), new Date(end)],
        },
      },
      group: ["`Contract->Contractor`.profession"],
      order: [[Sequelize.literal("totalEarned"), "DESC"]],
      limit,
    });
  }
}

module.exports = JobsRepository;