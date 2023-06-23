const routes = require('../../adapters/http/routes');
const ExpressWebServer = require('./express-webserver');

const getWebServer = () => {
  const server = new ExpressWebServer(routes);
  return server.app;
}

module.exports = {
  getWebServer
};