class JobAlreadyPaidError extends Error {
  constructor (id) {
    super(`Job with id ${id} is already paid`);
  }
}

module.exports = JobAlreadyPaidError;