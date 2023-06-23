const JobNotFoundError = require('../../errors/job-not-found-error');
const UserCannotAccessJobError = require('../../errors/user-cannot-access-job-error');
const JobAlreadyPaidError = require('../../errors/job-already-paid-error');
const InsufficientFundsError = require('../../errors/insufficient-funds-error');

class PayJob {
  constructor (jobsRepository, profilesRepository, contractRepository) {
    this.jobsRepository = jobsRepository;
    this.profilesRepository = profilesRepository;
    this.contractRepository = contractRepository;
  }

  async execute (id, profileId) {
    const job = await this.jobsRepository.get(id);

    if (!job) {
      throw new JobNotFoundError(id);
    }

    const contract = await this.contractRepository.get(job.ContractId);

    if (contract.ClientId !== profileId) {
      throw new UserCannotAccessJobError(profileId, id);
    }

    if (job.paid) {
      throw new JobAlreadyPaidError(id);
    }
  
    const client = await this.profilesRepository.get(profileId);
    const contractor = await this.profilesRepository.get(contract.ContractorId);
  
    if (client.balance < job.price) {
      throw new InsufficientFundsError();
    }
  
    client.balance -= job.price;
    contractor.balance += job.price;
    job.paid = true;
    job.paymentDate = new Date();

    const transaction = await this.jobsRepository.getTransaction();
    await this.jobsRepository.save(job, transaction);
    await this.profilesRepository.save(client, transaction);
    await this.profilesRepository.save(contractor, transaction);
    await transaction.commit();

    return job;
  }
}

module.exports = PayJob;