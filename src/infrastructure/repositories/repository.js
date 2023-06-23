class Repository {
  async get(id) {
    return await this.model.findByPk(id);
  }

  async save(model, transaction = null) {
    if (transaction) {
      await model.save({ transaction });
      return;
    }

    await model.save();
  }

  async getTransaction() {
    return await this.model.sequelize.transaction();
  }
}

module.exports = Repository;