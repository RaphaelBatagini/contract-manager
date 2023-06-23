class ListUnpaidJobs {
  constructor (jobsRepository) {
    this.jobsRepository = jobsRepository;
  }

  async execute (profileId) {
    return await this.jobsRepository.getUnpaid(profileId);
  }
}

module.exports = ListUnpaidJobs;