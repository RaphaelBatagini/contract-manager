const { getProfile } = require('../../infrastructure/middleware/getProfile');
const ContractsHttpController = require('./contracts-http-controller');
const JobsHttpController = require('./jobs-http-controller');
const ProfilesHttpController = require('./profiles-http-controller');

const routes = [
  {
    method: 'GET',
    path: '/contracts/:id',
    handler: ContractsHttpController.prototype.show,
    middlewares: [getProfile],
  },
  {
    method: 'GET',
    path: '/contracts',
    handler: ContractsHttpController.prototype.index,
    middlewares: [getProfile],
  },
  {
    method: 'GET',
    path: '/jobs/unpaid',
    handler: JobsHttpController.prototype.listUnpaid,
    middlewares: [getProfile],
  },
  {
    method: 'POST',
    path: '/jobs/:id/pay',
    handler: JobsHttpController.prototype.pay,
    middlewares: [getProfile],
  },
  {
    method: 'POST',
    path: '/balances/deposit/:userId',
    handler: ProfilesHttpController.prototype.deposit,
    middlewares: [getProfile],
  },
  {
    method: 'GET',
    path: '/admin/best-profession',
    handler: ProfilesHttpController.prototype.bestProfession,
  },
  {
    method: 'GET',
    path: '/admin/best-clients',
    handler: ProfilesHttpController.prototype.bestClients,
  },
];

module.exports = routes;