const getContractFactory = require("../../application/use-cases/get-contract/factory");
const ContractNotFoundError = require("../../application/errors/contract-not-found-error");
const UserCannotAccessContractError = require("../../application/errors/user-cannot-access-contract-error");

class ContractsHttpController {
  async index(request, response) {
    const contracts = await Contract.all()

    return response.json(contracts)
  }

  async show(request, response) {
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

      throw error;
    }
  }
}

module.exports = ContractsHttpController;