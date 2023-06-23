const express = require("express");
const httpStatus = require("http-status");
const bodyParser = require("body-parser");

class ExpressWebServer {
  constructor() {
    this.server = express();
  }

  async init(port, routes) {
    this.routes = routes;
    await this.routersSetup();
    this.listen(port, () => {
      console.info(`Listening on port ${port}`);
    });
  }

  listen(port, callback) {
    this.server.listen(port, callback);
  }

  async routersSetup() {
    const router = express.Router();

    this.setupLogs(router);

    this.routes.forEach((route) => {
      const routeMiddlewares = route.middlewares || [];

      router[route.method.toLowerCase()](
        route.path,
        ...(routeMiddlewares.map((middleware) => {
          if (typeof middleware === 'function') {
            return middleware;
          }
          return (req, res, next) => next();
        })),
        (req, res) => route.handler(req, res)
      );
    });
    this.server.use(router);
    this.server.use(bodyParser.json());

    this.server.use((error, _req, res, _next) => {
      const status = httpStatus.INTERNAL_SERVER_ERROR;

      console.error("Request/Response Error", error);
      res.status(status).json(error);
    });
  }

  setupLogs(router) {
    router.use((req, res, next) => {
      res.on("finish", () => {
        const date = new Date();
        console.info(
          `[${date.toISOString()}] ${req.method}:${req.url} ${res.statusCode}`
        ); 
      });
      next();
    });
  }
}

module.exports = ExpressWebServer;
