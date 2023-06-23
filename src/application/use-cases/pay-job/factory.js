const PayJob = require("./use-case");
const JobRepository = require("../../../infrastructure/repositories/jobs");
const ProfileRepository = require("../../../infrastructure/repositories/profiles");
const ContractsRepository = require("../../../infrastructure/repositories/contracts");

const payJobFactory = () => {
  const jobRepository = new JobRepository();
  const profileRepository = new ProfileRepository();
  const contractRepository = new ContractsRepository();
  return new PayJob(jobRepository, profileRepository, contractRepository);
}

module.exports = payJobFactory;