const { Profile } = require("../../domain");
const Repository = require("./repository");

class ProfilesRepository extends Repository {
  constructor() {
    super();
    this.model = Profile;
  }
}

module.exports = ProfilesRepository;