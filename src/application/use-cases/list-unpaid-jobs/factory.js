const ListUnpaidJobs = require("./use-case");
const JobRepository = require("../../../infrastructure/repositories/jobs");

const listUnpaidJobsFactory = () => {
  const jobRepository = new JobRepository();
  return new ListUnpaidJobs(jobRepository);
}

module.exports = listUnpaidJobsFactory;