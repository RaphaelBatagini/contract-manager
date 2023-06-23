const BestProfession = require("./use-case");
const JobRepository = require("../../../infrastructure/repositories/jobs");

const bestProfessionFactory = () => {
  const jobRepository = new JobRepository();
  return new BestProfession(jobRepository);
}

module.exports = bestProfessionFactory;