const { createContractMock, createProfileMock } = require('../mocks/models');
const { faker } = require('@faker-js/faker');
const { sequelize } = require('../setup');
const httpStatus = require('http-status');
const { loadEnvironmentVariables } = require('../../src/infrastructure/config/setup');
const server = require('../../src/server');
const supertest = require('supertest');
const { getWebServer } = require('../../src/infrastructure/webserver');

const app = getWebServer();
const agent = supertest.agent(app);

beforeAll((done) => {
  loadEnvironmentVariables();
  server.listen(+process.env.PORT);
  server.once('listening', done);
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

describe('Contract Routes', () => {
  describe('GET /contracts/:id', () => {
    it('should return a contract by id on a client request', async () => {
      const contract = await createContractMock();

      const res = await agent
        .get('/contracts/' + contract.id)
        .set('profile_id', contract.ClientId);

      expect(res.statusCode).toBe(httpStatus.OK);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('ClientId');
      expect(res.body).toHaveProperty('ContractorId');
      expect(res.body).toHaveProperty('terms');
      expect(res.body).toHaveProperty('status');

      expect(res.body.id).toBe(contract.id);
      expect(res.body.clientId).toBe(contract.clientId);
      expect(res.body.contractorId).toBe(contract.contractorId);
      expect(res.body.terms).toBe(contract.terms);
      expect(res.body.status).toBe(contract.status);
    });

    it('should return a contract by id on a contractor request', async () => {
      const contract = await createContractMock();

      const res = await agent
        .get('/contracts/' + contract.id)
        .set('profile_id', contract.ContractorId);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('ClientId');
      expect(res.body).toHaveProperty('ContractorId');
      expect(res.body).toHaveProperty('terms');
      expect(res.body).toHaveProperty('status');

      expect(res.body.id).toBe(contract.id);
      expect(res.body.clientId).toBe(contract.clientId);
      expect(res.body.contractorId).toBe(contract.contractorId);
      expect(res.body.terms).toBe(contract.terms);
      expect(res.body.status).toBe(contract.status);
    });

    it('should return 401 if the user isn\'t authenticated', async () => {
      const contract = await createContractMock();

      const res = await agent
        .get('/contracts/' + contract.id);

      expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should return 403 if the contract doesn\'t belong to the user', async () => {
      const contract = await createContractMock();
      const profile = await createProfileMock();

      const res = await agent
        .get('/contracts/' + contract.id)
        .set('profile_id', profile.id);

      expect(res.statusCode).toBe(httpStatus.FORBIDDEN);
      expect(res.text).toBe(`User ${profile.id} cannot access contract ${contract.id}`);
    });

    it('should return 404 if contract is not found', async () => {
      const profile = await createProfileMock();
      const contractId = faker.number.int({ min: 1, max: 100 });

      const res = await agent
        .get('/contracts/' + contractId)
        .set('profile_id', profile.id);

      expect(res.statusCode).toBe(httpStatus.NOT_FOUND);
      expect(res.text).toBe(`Contract ${contractId} not found`);
    });
  });

  describe('GET /contracts', () => {
    it('should return all non terminated contracts for the current user', async () => {
      const profile = await createProfileMock();
      await createContractMock({ ClientId: profile.id, status: 'terminated' });
      await createContractMock({ ContractorId: profile.id, status: 'terminated' });
      await createContractMock({ ClientId: profile.id, status: 'active' });
      await createContractMock({ ContractorId: profile.id, status: 'active' });

      const res = await agent
        .get('/contracts')
        .set('profile_id', profile.id);

      expect(res.statusCode).toBe(httpStatus.OK);
      expect(res.body).toHaveLength(2);
    });

    it('should return 401 if the user isn\'t authenticated', async () => {
      const res = await agent
        .get('/contracts');

      expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });
  });
});