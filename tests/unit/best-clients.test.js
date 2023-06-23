const {
  createProfileMock,
  createContractMock,
  createJobMock,
} = require("../mocks/models");
const getBestClientsFactory = require("../../src/application/use-cases/best-clients/factory");
const { faker } = require("@faker-js/faker");
const { loadEnvironmentVariables } = require("../../src/infrastructure/config/setup");
const NoPaymentFoundInPeriodError = require("../../src/application/errors/no-payment-found-in-period-error");

beforeAll(() => {
  loadEnvironmentVariables();
});

describe("Best Clients Use Case", () => {
  const sut = getBestClientsFactory();

  describe("getBestClients", () => {
    it("should return the best clients", async () => {
      const client1 = await createProfileMock({ type: "client" });
      const client2 = await createProfileMock({ type: "client" });
      const contract1 = await createContractMock({
        status: "in_progress",
        ClientId: client1.id,
      });
      const contract2 = await createContractMock({
        status: "new",
        ClientId: client2.id,
      });
      await createJobMock({
        paid: true,
        paymentDate: faker.date.recent({ days: 3 }),
        ContractId: contract1.id,
        price: 150,
      });
      await createJobMock({
        paid: true,
        paymentDate: faker.date.recent({ days: 3 }),
        ContractId: contract1.id,
        price: 150,
      });
      await createJobMock({
        paid: true,
        paymentDate: faker.date.recent({ days: 3 }),
        ContractId: contract1.id,
        price: 150,
      });
      await createJobMock({
        paid: true,
        paymentDate: faker.date.recent({ days: 3 }),
        ContractId: contract2.id,
        price: 150,
      });
      await createJobMock({
        paid: true,
        paymentDate: faker.date.recent({ days: 3 }),
        ContractId: contract2.id,
        price: 150,
      });

      const bestClients = await sut.execute(
        faker.date.past({ year: 1 }),
        faker.date.future({ year: 1 }),
        2
      );

      expect(bestClients).toHaveLength(2);
      expect(bestClients[0].id).toBe(client1.id);
      expect(bestClients[0].fullName).toBe(
        client1.firstName + " " + client1.lastName
      );
      expect(bestClients[0].paid).toBe(450);
      expect(bestClients[1].id).toBe(client2.id);
      expect(bestClients[1].fullName).toBe(
        client2.firstName + " " + client2.lastName
      );
      expect(bestClients[1].paid).toBe(300);
    });

    it("should return the best clients within the given limit", async () => {
      const client1 = await createProfileMock({ type: "client" });
      const client2 = await createProfileMock({ type: "client" });
      const client3 = await createProfileMock({ type: "client" });
      const contract1 = await createContractMock({
        status: "in_progress",
        ClientId: client1.id,
      });
      const contract2 = await createContractMock({
        status: "new",
        ClientId: client2.id,
      });
      const contract3 = await createContractMock({
        status: "new",
        ClientId: client3.id,
      });
      await createJobMock({
        paid: true,
        paymentDate: faker.date.recent({ days: 3 }),
        ContractId: contract1.id,
        price: 150,
      });
      await createJobMock({
        paid: true,
        paymentDate: faker.date.recent({ days: 3 }),
        ContractId: contract1.id,
        price: 150,
      });
      await createJobMock({
        paid: true,
        paymentDate: faker.date.recent({ days: 3 }),
        ContractId: contract1.id,
        price: 150,
      });
      await createJobMock({
        paid: true,
        paymentDate: faker.date.recent({ days: 3 }),
        ContractId: contract2.id,
        price: 150,
      });
      await createJobMock({
        paid: true,
        paymentDate: faker.date.recent({ days: 3 }),
        ContractId: contract2.id,
        price: 150,
      });
      await createJobMock({
        paid: true,
        paymentDate: faker.date.recent({ days: 3 }),
        ContractId: contract3.id,
        price: 1000,
      });

      const bestClients = await sut.execute(
        faker.date.past({ year: 1 }),
        faker.date.future({ year: 1 }),
        2
      );

      expect(bestClients).toHaveLength(2);

      const bestClientsIds = bestClients.map((client) => client.id);
      expect(bestClientsIds).toEqual([client3.id, client1.id]);
    });

    it("should throw NoPaymentFoundInPeriodError if no payments are found", async () => {
      await createJobMock({ paid: true, paymentDate: faker.date.past() });

      const startDate = faker.date.soon();
      const endDate = faker.date.future({ refDate: startDate });
      expect(sut.execute(startDate, endDate, 1)).rejects.toThrow(NoPaymentFoundInPeriodError);
    });
  });
});
