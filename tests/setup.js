const { loadEnvironmentVariables } = require('../src/infrastructure/config/setup');
const server = require('../src/server');
const supertest = require('supertest');
const { getWebServer } = require('../src/infrastructure/webserver');
const { sequelize } = require('../src/infrastructure/database');

const app = getWebServer();
const agent = supertest.agent(app);

beforeAll((done) => {
  loadEnvironmentVariables();
  server.listen(+process.env.PORT, () => {
    done();
  });
});

afterAll((done) => {
  sequelize.close();
  server.close(done);
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

module.exports = {
  sequelize,
  agent,
};
