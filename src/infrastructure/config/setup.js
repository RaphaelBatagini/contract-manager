const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const loadEnvironmentVariables = () => {
  if (!process.env.NODE_ENV) {
    throw new Error('The NODE_ENV environment variable is required but was not specified.');
  }

  const envFilePath = path.resolve(__dirname, `./../../../.env.${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV !== 'production' && fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
  } else {
    dotenv.config();
  }
}

module.exports = {
  loadEnvironmentVariables,
}