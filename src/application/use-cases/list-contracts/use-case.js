class ListContracts {
  constructor (contractRepository) {
    this.contractRepository = contractRepository;
  }

  async execute (profileId) {
    return await this.contractRepository.getAll(profileId);
  }
}

module.exports = ListContracts;