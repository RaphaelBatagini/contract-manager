const { createProfileMock, createJobMock } = require('../mocks/models');
const { agent } = require('../setup');

describe('Job Routes', () => {
  describe('GET /jobs/unpaid', () => {
    it('should return all unpaid jobs for the current user', async () => {
      const client = await createProfileMock();
      const job = await createJobMock({ paid: false, ClientId: client.id });
      await createJobMock({ paid: true, ContractId: job.ContractId });

      const res = await agent
        .get('/jobs/unpaid')
        .set('profile_id', client.id)
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(job.id);
    });
  });
});