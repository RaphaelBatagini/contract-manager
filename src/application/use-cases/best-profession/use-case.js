const NoJobFoundInPeriodError = require("../../errors/no-job-found-in-period-error");

class BestProfession {
  constructor (jobsRepository) {
    this.jobsRepository = jobsRepository;
  }

  async execute (startDate, endDate) {
    const professions = await this.jobsRepository.getProfessionsIncome(startDate, endDate, 1);

    if (!professions.length) {
      throw new NoJobFoundInPeriodError(startDate, endDate);
    }

    return professions[0].getDataValue('profession');
  }
}

module.exports = BestProfession;