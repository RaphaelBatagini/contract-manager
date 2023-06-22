const request = require('supertest');
const app = require('../../src/app');
const { createContractMock, createProfileMock } = require('../mocks/models');
const { faker } = require('@faker-js/faker');

describe('Contract Routes', () => {
  describe('GET /contracts/:id', () => {
    it('should return a contract by id on a client request', async () => {
      const contract = await createContractMock();

      const res = await request(app)
        .get('/contracts/' + contract.id)
        .set('profile_id', contract.ClientId);

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

    it('should return a contract by id on a contractor request', async () => {
      const contract = await createContractMock();

      const res = await request(app)
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

      const res = await request(app)
        .get('/contracts/' + contract.id);

      expect(res.statusCode).toBe(401);
    });

    it('should return 403 if the contract doesn\'t belong to the user', async () => {
      const contract = await createContractMock();
      const profile = await createProfileMock();

      const res = await request(app)
        .get('/contracts/' + contract.id)
        .set('profile_id', profile.id);

      expect(res.statusCode).toBe(403);
      expect(res.text).toBe('contract doesn\'t belong to the user');
    });

    it('should return 404 if contract is not found', async () => {
      const profile = await createProfileMock();

      const res = await request(app)
        .get('/contracts/' + faker.number.int({ min: 1, max: 100 }))
        .set('profile_id', profile.id);

      expect(res.statusCode).toBe(404);
      expect(res.text).toBe('contract not found');
    });
  });

  describe('GET /contracts', () => {
    it('should return all non terminated contracts for the current user', async () => {
      const profile = await createProfileMock();
      await createContractMock({ ClientId: profile.id, status: 'terminated' });
      await createContractMock({ ContractorId: profile.id, status: 'terminated' });
      await createContractMock({ ClientId: profile.id, status: 'active' });
      await createContractMock({ ContractorId: profile.id, status: 'active' });

      const res = await request(app)
        .get('/contracts')
        .set('profile_id', profile.id);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('should return 401 if the user isn\'t authenticated', async () => {
      const res = await request(app)
        .get('/contracts');

      expect(res.statusCode).toBe(401);
    });
  });
});