const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile');
const { Sequelize } = require('sequelize');
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * @returns contract by id
 */
app.get('/contracts/:id',getProfile,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const {profile} = req
    const contract = await Contract.findOne({
      where: {
        id,
        [profile.type === 'client' ? 'ClientId' :  'ContractorId']: profile.id
      }
    })
    if(!contract) return res.status(404).end()
    res.json(contract)
})

/**
 * @returns all non terminated contracts for the current user
 */
app.get('/contracts',getProfile,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const {profile} = req
    const contracts = await Contract.findAll({
      where: {
        [profile.type === 'client' ? 'ClientId' :  'ContractorId']: profile.id,
        status: {
          [Sequelize.Op.ne]: 'terminated'
        }
      }
    })
    res.json(contracts)
})

/**
 * @returns all unpaid jobs for the current user
 */
app.get('/jobs/unpaid',getProfile,async (req, res) =>{
    const {Job,Contract} = req.app.get('models')
    const {profile} = req
    const jobs = await Job.findAll({
      where: {
        [Sequelize.Op.or]: [
          {paid: false},
          {paid: null}
        ]
      },
      include: [{
        model: Contract,
        where: {
          status: {
            [Sequelize.Op.ne]: 'terminated'
          },
          [profile.type === 'client' ? 'ClientId' :  'ContractorId']: profile.id
        }
      }]
    })
    res.json(jobs)
})

/**
 * @returns the paid job
 */
app.post('/jobs/:job_id/pay',getProfile,async (req, res) =>{
  const {Job,Contract,Profile} = req.app.get('models')
  const {profile} = req
  const {job_id} = req.params
  const job = await Job.findOne({
    where: {
      id: job_id,
      [Sequelize.Op.or]: [
        {paid: false},
        {paid: null}
      ]
    },
    include: [{
      model: Contract,
      where: {
        ['ClientId']: profile.id
      }
    }]
  })
  if(!job) return res.status(404).end()
  const client = await Profile.findOne({
    where: {
      id: job.Contract.ClientId
    }
  })
  const contractor = await Profile.findOne({
    where: {
      id: job.Contract.ContractorId
    }
  })
  if(client.balance < job.price) return res.status(400).end('insufficient funds')
  client.balance -= job.price
  contractor.balance += job.price
  job.paid = true
  job.paymentDate = new Date()
  await client.save()
  await contractor.save()
  await job.save()
  res.json(job)
})

module.exports = app;
