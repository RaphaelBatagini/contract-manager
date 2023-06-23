class NoJobFoundInPeriodError extends Error {
  constructor (startDate, endDate) {
    super(`No jobs found in period ${startDate} - ${endDate}`);
    this.name = 'NoJobFoundInPeriodError';
  }
}

module.exports = NoJobFoundInPeriodError;