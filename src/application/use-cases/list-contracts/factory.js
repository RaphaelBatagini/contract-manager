const ListContracts = require("./use-case");
const ContractRepository = require("../../../infrastructure/repositories/contracts");

const listContractFactory = () => {
  const contractRepository = new ContractRepository();
  return new ListContracts(contractRepository);
}

module.exports = listContractFactory;