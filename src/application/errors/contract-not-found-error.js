class ContractNotFoundError extends Error {
  constructor (id) {
    super(`Contract ${id} not found`);
    this.name = 'ContractNotFoundError';
  }
}

module.exports = ContractNotFoundError;