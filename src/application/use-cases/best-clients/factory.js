const BestClients = require("./use-case");
const JobRepository = require("../../../infrastructure/repositories/jobs");

const bestClientsFactory = () => {
  const jobRepository = new JobRepository();
  return new BestClients(jobRepository);
}

module.exports = bestClientsFactory;