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

module.exports = app;