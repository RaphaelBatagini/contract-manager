const { getWebServer } = require('./infrastructure/webserver/index');
const routes = require('./adapters/http/routes');
const { loadEnvironmentVariables } = require('./infrastructure/config/setup');
const EXIT_CODES = {
  SUCCESS: 0,
  FAILURE: 1,
};

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Server exiting due to an unhandled promise rejection: ${promise} and reason ${reason}`);
  throw reason;
});

process.on('uncaughtException', (error) => {
  console.error('Server exiting due to uncaught exception', error);
  process.exit(EXIT_CODES.FAILURE);
});

async function initServer() {
  try {
    loadEnvironmentVariables();
    const webserver = getWebServer();
    webserver.init(+process.env.PORT, routes);
    handleExit();
  } catch (err) {
    console.error('Server exiting due to an error during initialization', err);
    process.exit(EXIT_CODES.FAILURE);
  }
}

function handleExit() {
  const exitSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

  exitSignals.forEach((sig) => {
    process.on(sig, async () => {
      try {
        console.log(`Received ${sig}. Shutting down server`);
        process.exit(EXIT_CODES.SUCCESS);
      } catch (err) {
        console.error(`Error during server shutdown`, err);
        process.exit(EXIT_CODES.FAILURE);
      }
    });
  });
}

initServer();