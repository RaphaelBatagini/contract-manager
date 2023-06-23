const express = require("express");
const bodyParser = require("body-parser");
const { getProfile } = require("./infrastructure/middleware/getProfile");
const { Sequelize } = require("sequelize");
const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

/**
 * @returns all non terminated contracts for the current user
 */
app.get("/contracts", getProfile, async (req, res) => {
  const { Contract } = req.app.get("models");
  const { profile } = req;

  const contracts = await Contract.findAll({
    where: {
      [Sequelize.Op.or]: [
        { ClientId: profile.id },
        { ContractorId: profile.id },
      ],
      status: {
        [Sequelize.Op.ne]: "terminated",
      },
    },
  });

  res.json(contracts);
});

/**
 * @returns all unpaid jobs for the current user
 */
app.get("/jobs/unpaid", getProfile, async (req, res) => {
  const { Job, Contract } = req.app.get("models");
  const { profile } = req;

  const jobs = await Job.findAll({
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
            { ClientId: profile.id },
            { ContractorId: profile.id },
          ],
        },
      },
    ],
  });

  res.json(jobs);
});

/**
 * @returns the paid job
 */
app.post("/jobs/:job_id/pay", getProfile, async (req, res) => {
  const { Job, Contract, Profile } = req.app.get("models");
  const { profile } = req;
  const { job_id } = req.params;

  const job = await Job.findOne({
    where: {
      id: job_id,
      [Sequelize.Op.or]: [{ paid: false }, { paid: null }],
    },
    include: [
      {
        model: Contract,
        where: {
          ["ClientId"]: profile.id,
        },
      },
    ],
  });

  if (!job) return res.status(404).end('job not found');

  const client = await Profile.findOne({
    where: {
      id: job.Contract.ClientId,
    },
  });

  const contractor = await Profile.findOne({
    where: {
      id: job.Contract.ContractorId,
    },
  });

  if (client.balance < job.price) {
    return res.status(400).end("insufficient funds");
  }

  client.balance -= job.price;
  contractor.balance += job.price;
  job.paid = true;
  job.paymentDate = new Date();

  await client.save();
  await contractor.save();
  await job.save();

  res.json(job);
});

/**
 * @returns void
 */
app.post("/balances/deposit/:userId", getProfile, async (req, res) => {
  const { Profile, Job, Contract } = req.app.get("models");
  const { profile } = req;
  const { userId } = req.params;

  const client = await Profile.findOne({ where: { id: userId, type: "client" } });
  if (!client) return res.status(404).end("client not found");

  const { depositAmount } = req.body;

  if (profile.type === "client") {
    const jobsToPay = await Job.findAll({
      where: {
        [Sequelize.Op.or]: [{ paid: false }, { paid: null }],
      },
      include: [
        {
          model: Contract,
          where: {
            ["ClientId"]: profile.id,
          },
        }
      ]
    });

    const pendingPaymentsAmount = jobsToPay.reduce((total, job) => total + job.price, 0);

    if (depositAmount > pendingPaymentsAmount * 0.25) {
      return res
        .status(400)
        .end("can't deposit more than 25% of the total of jobs to pay");
    }
  }

  client.balance += depositAmount;
  await client.save();

  res.status(200).end();
});

/**
 * @returns the profession that earned the most money in the query time range.
 */
app.get('/admin/best-profession', async (req, res) => {
  const { Profile, Contract, Job } = req.app.get('models');
  const { start, end } = req.query;

  const professionStats = await Job.findAll({
    attributes: [
      [Sequelize.literal('`Contract->Contractor`.profession'), 'profession'],
      [Sequelize.fn('sum', Sequelize.col('price')), 'totalEarned'],
    ],
    include: [
      {
        model: Contract,
        as: 'Contract',
        include: [
          {
            model: Profile,
            as: 'Contractor',
            where: {
              profession: { [Sequelize.Op.not]: null },
              type: 'contractor',
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
    group: ['`Contract->Contractor`.profession'],
    order: [[Sequelize.literal('totalEarned'), 'DESC']],
    limit: 1,
  });

  if (professionStats.length === 0) {
    return res.status(404).json({ message: 'No data found for the given time range' });
  }

  const bestProfession = professionStats[0].getDataValue('profession');
  res.json({ bestProfession });
});

/**
 * @returns the profession that earned the most money in the query time range.
 */
app.get('/admin/best-clients', async (req, res) => {
  const { Profile, Contract, Job } = req.app.get('models');
  const { start, end } = req.query;
  const { limit } = req.query || 2;

  const clientStats = await Job.findAll({
    raw: true,
    attributes: [
      [Sequelize.literal('`Contract->Client`.id'), 'id'],
      [Sequelize.literal('`Contract->Client`.firstName || \' \' || `Contract->Client`.lastName'), 'fullName'],
      [Sequelize.fn('sum', Sequelize.col('price')), 'paid'],
    ],
    include: [
      {
        model: Contract,
        as: 'Contract',
        include: [
          {
            model: Profile,
            as: 'Client',
            where: {
              type: 'client',
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
    group: ['`Contract->Client`.id'],
    order: [[Sequelize.literal('paid'), 'DESC']],
    limit,
  });

  if (clientStats.length === 0) {
    return res.status(404).json({ message: 'No data found for the given time range' });
  }

  res.json({ clientStats });
});


module.exports = app;
