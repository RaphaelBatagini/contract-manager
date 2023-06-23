const ContractNotFoundError = require("../../errors/contract-not-found-error");
const UserCannotAccessContractError = require("../../errors/user-cannot-access-contract-error");

class GetContract {
  constructor (contractRepository) {
    this.contractRepository = contractRepository;
  }

  async execute (contractId, profileId) {
    const contract = await this.contractRepository.get(contractId);
  
    if (!contract) {
      throw new ContractNotFoundError(contractId, profileId);
    }
  
    if (contract.ClientId !== profileId && contract.ContractorId !== profileId) {
      throw new UserCannotAccessContractError(profileId, contractId);
    }
  
    return contract;
  }
}

module.exports = GetContract;