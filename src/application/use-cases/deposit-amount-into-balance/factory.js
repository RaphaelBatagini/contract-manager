const DepositAmountIntoBalance = require("./use-case");
const JobsRepository = require("../../../infrastructure/repositories/jobs");
const ProfileRepository = require("../../../infrastructure/repositories/profiles");

const depositAmountIntoBalanceFactory = () => {
  const jobsRepository = new JobsRepository();
  const profileRepository = new ProfileRepository();
  return new DepositAmountIntoBalance(jobsRepository, profileRepository);
}

module.exports = depositAmountIntoBalanceFactory;