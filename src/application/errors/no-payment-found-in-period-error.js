class NoPaymentFoundInPeriodError extends Error {
  constructor (startDate, endDate) {
    super(`No payment found in period ${startDate} - ${endDate}`);
    this.name = 'NoPaymentFoundInPeriodError';
  }
}

module.exports = NoPaymentFoundInPeriodError;