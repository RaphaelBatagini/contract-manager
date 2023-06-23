const { getProfile } = require('../../infrastructure/middleware/getProfile');
const ContractsHttpController = require('./contracts-http-controller');

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
    handler: ContractsHttpController.prototype.show,
  },
  {
    method: 'GET',
    path: '/jobs/unpaid',
    handler: ContractsHttpController.prototype.show,
  },
  {
    method: 'POST',
    path: '/jobs/:id/pay',
    handler: ContractsHttpController.prototype.show,
  },
  {
    method: 'POST',
    path: '/balances/deposit/:userId',
    handler: ContractsHttpController.prototype.show,
  },
  {
    method: 'GET',
    path: '/admin/best-profession',
    handler: ContractsHttpController.prototype.show,
  },
  {
    method: 'GET',
    path: '/admin/best-clients',
    handler: ContractsHttpController.prototype.show,
  },
];

module.exports = routes;