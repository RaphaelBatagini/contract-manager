class ContractsRepository {
  constructor() {
    this.model = require("../../domain/contract");
  }

  async get(id) {
    return await this.model.findByPk(id);
  }
}

module.exports = ContractsRepository;