const NoPaymentFoundInPeriodError = require("../../errors/no-payment-found-in-period-error");

class BestClient {
  constructor (jobsRepository) {
    this.jobsRepository = jobsRepository;
  }

  async execute (startDate, endDate, limit) {
    const payments = await this.jobsRepository.getClientsTotalPayments(startDate, endDate, limit);

    if (!payments.length) {
      throw new NoPaymentFoundInPeriodError(startDate, endDate);
    }

    return payments.map(payment => {
      const { dataValues: { id, fullName, paid } } = payment;
      return { id, fullName, paid };
    });
  }
}

module.exports = BestClient;