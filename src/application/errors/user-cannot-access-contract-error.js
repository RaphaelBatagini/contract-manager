class UserCannotAccessContractError extends Error {
  constructor(userId, contractId) {
    super(`User ${userId} cannot access contract ${contractId}`);
    this.name = "UserCannotAccessContractError";
  }
}

module.exports = UserCannotAccessContractError;