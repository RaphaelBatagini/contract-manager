const ClientNotFoundError = require("../../errors/client-not-found-error");
const DepositAmountExceedsLimitError = require("../../errors/deposit-amount-exceeds-limit-error");

class DepositAmountIntoBalance {
  constructor(jobsRepository, profileRepository) {
    this.jobsRepository = jobsRepository;
    this.profileRepository = profileRepository;
  }

  async execute(userId, clientId, depositAmount) {
    const client = await this.profileRepository.get(clientId);

    if (!client) throw new ClientNotFoundError(clientId);

    const user = await this.profileRepository.get(userId);

    if (user.type === "client") {
      const jobsToPay = await this.jobsRepository.getAllUnpaid(userId);

      const pendingPaymentsAmount = jobsToPay.reduce((total, job) => total + job.price, 0);

      if (pendingPaymentsAmount > 0 && depositAmount > pendingPaymentsAmount * 0.25) {
        throw new DepositAmountExceedsLimitError(pendingPaymentsAmount * 0.25);
      }
    }

    client.balance += depositAmount;
    await client.save();

    return client;
  }
}

module.exports = DepositAmountIntoBalance;