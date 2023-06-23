const listUnpaidJobsFactory = require("../../application/use-cases/list-unpaid-jobs/factory");
const ContractNotFoundError = require("../../application/errors/contract-not-found-error");
const UserCannotAccessContractError = require("../../application/errors/user-cannot-access-contract-error");

class JobsHttpController {
  async listUnpaid(request, response) {
    const { profile } = request;

    const listUnpaidJobs = listUnpaidJobsFactory();

    try {
      const jobs = await listUnpaidJobs.execute(profile.id);
      return response.json(jobs);
    } catch (error) {
      throw error;
      return response.status(500).end("internal server error");
    }
  }

  async pay(request, response) {
    const { id } = request.params;
    const { profile } = request;

    const getContract = getContractFactory();

    try {
      const contract = await getContract.execute(id, profile.id);
      return response.json(contract);
    } catch (error) {
      if (error instanceof ContractNotFoundError) {
        return response.status(404).end("contract not found");
      }

      if (error instanceof UserCannotAccessContractError) {
        return response.status(403).end("contract doesn't belong to the user");
      }

      return response.status(500).end("internal server error");
    }
  }
}

module.exports = JobsHttpController;