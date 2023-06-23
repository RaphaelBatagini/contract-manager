class ListUnpaidJobs {
  constructor (jobsRepository) {
    this.jobsRepository = jobsRepository;
  }

  async execute (profileId) {
    return await this.jobsRepository.getAllUnpaid(profileId);
  }
}

module.exports = ListUnpaidJobs;