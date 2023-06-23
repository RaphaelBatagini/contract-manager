const PayJob = require("./use-case");
const JobRepository = require("../../../infrastructure/repositories/jobs");
const ProfileRepository = require("../../../infrastructure/repositories/profiles");

const payJobFactory = () => {
  const jobRepository = new JobRepository();
  const profileRepository = new ProfileRepository();
  return new PayJob(jobRepository, profileRepository);
}

module.exports = payJobFactory;