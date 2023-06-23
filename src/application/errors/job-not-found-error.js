class JobNotFoundError extends Error {
  constructor (id) {
    super(`Job ${id} not found`);
    this.name = 'JobNotFoundError';
  }
}

module.exports = JobNotFoundError;