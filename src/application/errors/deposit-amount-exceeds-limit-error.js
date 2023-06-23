class DepositAmountExceedsLimitError extends Error {
  constructor(amount) {
    super(`Deposit amount exceeds the limit of ${amount}`);
  }
}

module.exports = DepositAmountExceedsLimitError;