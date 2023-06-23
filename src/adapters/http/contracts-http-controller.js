const getContractFactory = require("../../application/use-cases/get-contract/factory");
const listContractFactory = require("../../application/use-cases/list-contracts/factory");
const ContractNotFoundError = require("../../application/errors/contract-not-found-error");
const UserCannotAccessContractError = require("../../application/errors/user-cannot-access-contract-error");
const httpStatus = require("http-status");

class ContractsHttpController {
  async index(request, response) {
    const { profile } = request;

    const listContracts = listContractFactory();

    try {
      const contracts = await listContracts.execute(profile.id);
      return response.json(contracts);
    } catch (error) {
      return response
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .end("internal server error");
    }
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
        return response.status(httpStatus.NOT_FOUND).end(error.message);
      }

      if (error instanceof UserCannotAccessContractError) {
        return response.status(httpStatus.FORBIDDEN).end(error.message);
      }

      return response
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .end("internal server error");
    }
  }
}

module.exports = ContractsHttpController;
