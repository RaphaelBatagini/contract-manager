class UserCannotAccessJobError extends Error {
  constructor(userId, jobId) {
    super(`User ${userId} cannot access job ${jobId}`);
    this.name = "UserCannotAccessJobError";
  }
}

module.exports = UserCannotAccessJobError;