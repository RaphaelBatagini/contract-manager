const { getWebServer } = require('./infrastructure/webserver/index');
const { loadEnvironmentVariables } = require('./infrastructure/config/setup');
const http = require('http');

loadEnvironmentVariables();
const app = getWebServer();
const server = http.createServer(app);

if (require.main === module) {
  server.listen(+process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });
}

module.exports = server;