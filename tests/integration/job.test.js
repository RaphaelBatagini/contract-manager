const httpStatus = require("http-status");
const {
  createJobMock,
  createProfileMock,
  createContractMock,
} = require("../mocks/models");
const { sequelize } = require("../setup");
const {
  loadEnvironmentVariables,
} = require("../../src/infrastructure/config/setup");
const server = require("../../src/server");
const { getWebServer } = require("../../src/infrastructure/webserver");
const supertest = require("supertest");
const { faker } = require("@faker-js/faker");

const app = getWebServer();
const agent = supertest.agent(app);

beforeAll((done) => {
  loadEnvironmentVariables();
  server.listen(+process.env.PORT);
  server.once("listening", done);
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

describe("Job Routes", () => {
  describe("GET /jobs/unpaid", () => {
    it("should return all unpaid jobs for the current user", async () => {
      const contract1 = await createContractMock({ status: "in_progress" });
      const contract2 = await createContractMock({ status: "new" });
      const job1 = await createJobMock({
        paid: false,
        ContractId: contract1.id,
      });
      const job2 = await createJobMock({
        paid: true,
        ContractId: contract1.id,
      });
      const job3 = await createJobMock({
        paid: false,
        ContractId: contract2.id,
      });

      const res = await agent
        .get("/jobs/unpaid")
        .set("profile_id", contract1.ClientId)
        .expect(httpStatus.OK);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe(job1.id);
    });
  });

  describe("POST /jobs/:id/pay", () => {
    it("should mark a job as paid when client has enough money", async () => {
      const clientBalance = faker.number.float({ min: 3, max: 1000 });
      const client = await createProfileMock({ balance: clientBalance });
      const contract = await createContractMock({ ClientId: client.id });
      const job = await createJobMock({
        paid: false,
        ContractId: contract.id,
        price: faker.number.float({ min: 1, max: clientBalance - 1 }),
      });

      const res = await agent
        .post("/jobs/" + job.id + "/pay")
        .set("profile_id", contract.ClientId)
        .expect(httpStatus.OK);

      expect(res.body).toHaveProperty("paid", true);
    });

    it("should return 400 when client doesn't have enough money", async () => {
      const clientBalance = faker.number.float({ min: 3, max: 100 });
      const client = await createProfileMock({ balance: clientBalance });
      const contract = await createContractMock({ ClientId: client.id });
      const job = await createJobMock({
        paid: false,
        ContractId: contract.id,
        price: clientBalance + 1,
      });

      await agent
        .post("/jobs/" + job.id + "/pay")
        .set("profile_id", contract.ClientId)
        .expect(httpStatus.BAD_REQUEST);
    });

    it("should return 404 if the job does not exist", async () => {
      const user = await createProfileMock();

      await agent
        .post("/jobs/123/pay")
        .set("profile_id", user.id)
        .expect(httpStatus.NOT_FOUND);
    });

    it("should return 403 if the job does not belong to the current user", async () => {
      const user = await createProfileMock();
      const job = await createJobMock();

      await agent
        .post("/jobs/" + job.id + "/pay")
        .set("profile_id", user.id)
        .expect(httpStatus.FORBIDDEN);
    });
  });
});
