const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const loadEnvironmentVariables = () => {
  const envFilePath = path.resolve(__dirname, `./../../../.env.${process.env.ENVIROMENT}`);
  if (process.env.ENVIROMENT !== 'production' && fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
  } else {
    dotenv.config();
  }
}

module.exports = {
  loadEnvironmentVariables,
}