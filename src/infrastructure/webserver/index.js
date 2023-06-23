const ExpressWebServer = require('./express-webserver');

class WebServer {
  constructor(server) {
    this.server = server;
  }

  async init(port, routes) {
    await this.server.init(port, routes);
  }
}

const getWebServer = () => {
  const server = new ExpressWebServer();
  return new WebServer(server);
}

module.exports = {
  WebServer,
  getWebServer
};