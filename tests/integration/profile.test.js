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

describe("Profile Routes", () => {
  describe("POST /balances/deposit/:userId", () => {
    it("should deposit the amount to the user's balance", async () => {
      const profile = await createProfileMock({ type: "client" });
      const contract = await createContractMock({
        status: "in_progress",
        ClientId: profile.id,
      });
      const job1 = await createJobMock({
        paid: false,
        ContractId: contract.id,
      });
      const job2 = await createJobMock({
        paid: false,
        ContractId: contract.id,
      });

      const depositAmount = faker.number.float({
        min: 1,
        max: (job1.price + job2.price) * 0.25, // 25% of the unpaid jobs
        precision: 0.01,
      });

      const res = await agent
        .post(`/balances/deposit/${profile.id}`)
        .set("profile_id", profile.id)
        .send({ depositAmount })
        .expect(httpStatus.OK);

      expect(res.body.balance).toBe(profile.balance + depositAmount);
    });

    it("should return BAD_REQUEST if the deposit amount is greater than 25% of the unpaid jobs", async () => {
      const profile = await createProfileMock({ type: "client" });
      const contract = await createContractMock({
        status: "in_progress",
        ClientId: profile.id,
      });
      const job1 = await createJobMock({
        paid: false,
        ContractId: contract.id,
      });
      const job2 = await createJobMock({
        paid: false,
        ContractId: contract.id,
      });

      const invalidMinDepositAmount = (job1.price + job2.price) * 0.26; // 26% of the unpaid jobs
      const depositAmount = faker.number.float({
        min: invalidMinDepositAmount,
        max: invalidMinDepositAmount + 1000, 
        precision: 0.01,
      });

      const res = await agent
        .post(`/balances/deposit/${profile.id}`)
        .set("profile_id", profile.id)
        .send({ depositAmount })
        .expect(httpStatus.BAD_REQUEST);

      expect(res.text).toBe(`Deposit amount exceeds the limit of ${(job1.price + job2.price) * 0.25}`);
    });

    it("should return NOT_FOUND if the user does not exist", async () => {
      const profile = await createProfileMock({ type: "client" });
      const clientId = faker.number.int({ min: 1, max: 1000 });

      const res = await agent
        .post(`/balances/deposit/${clientId}`)
        .set("profile_id", profile.id)
        .send({ depositAmount: faker.number.float({ min: 1, max: 1000, precision: 0.01 }) })
        .expect(httpStatus.NOT_FOUND);

      expect(res.text).toBe(`Client ${clientId} not found`);
    });

    it("should return UNAUTHORIZED if the user is not logged in", async () => {
      const profile = await createProfileMock({ type: "client" });
      const depositAmount = faker.number.float({ min: 1, max: 1000, precision: 0.01 });

      await agent
        .post(`/balances/deposit/${profile.id}`)
        .send({ depositAmount })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
});
