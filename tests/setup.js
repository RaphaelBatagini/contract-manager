const { sequelize } = require('../src/infrastructure/database');

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

module.exports = {
  sequelize,
};
