const { faker } = require('@faker-js/faker');
const { Profile, Contract, Job } = require('../../src/domain');

async function createProfileMock(properties = {}) {
  const defaultProperties = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    profession: faker.person.jobTitle(),
    balance: faker.number.float({ min: 0, max: 10000, precision: 0.01 }),
    type: faker.helpers.arrayElement(['client', 'contractor']),
  };

  return await Profile.create({ ...defaultProperties, ...properties });
}

async function createContractMock(properties = {}) {
  const defaultProperties = {
    terms: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(['new', 'in_progress', 'terminated']),
  };

  const { ContractorId, ClientId, ...restProperties } = properties;

  const contract = await Contract.create({ ...defaultProperties, ...restProperties });

  const contractor = await Profile.findByPk(ContractorId) || await createProfileMock({ type: 'contractor' });
  await contract.setContractor(contractor);

  const client = await Profile.findByPk(properties.ClientId) || await createProfileMock({ type: 'client' });
  await contract.setClient(client);

  await contract.save();

  return contract;
}

async function createJobMock(properties = {}) {
  const paid = faker.datatype.boolean();
  const defaultProperties = {
    description: faker.lorem.sentence(),
    price: faker.number.float({ min: 0, max: 10000, precision: 0.01 }),
    paid,
    paymentDate: paid ? faker.date.past() : null,
  };

  const { ContractId, ...restProperties } = properties;

  const job = await Job.create({ ...defaultProperties, ...restProperties });

  const contract = await Contract.findByPk(ContractId) || await createContractMock();
  await job.setContract(contract);

  await job.save();

  return job;
}

module.exports = {
  createProfileMock,
  createContractMock,
  createJobMock,
};