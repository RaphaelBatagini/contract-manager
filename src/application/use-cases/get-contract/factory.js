const GetContract = require("./use-case");
const ContractRepository = require("../../../infrastructure/repositories/contracts");

const getContractFactory = () => {
  const contractRepository = new ContractRepository();
  return new GetContract(contractRepository);
}

module.exports = getContractFactory;