const express = require("express");
const httpStatus = require("http-status");
const bodyParser = require("body-parser");

class ExpressWebServer {
  constructor(routes) {
    this.app = express();
    this.routes = routes;
    this.routersSetup();
  }

  routersSetup() {
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
    this.app.use(bodyParser.json());
    this.app.use(router);

    this.app.use((error, _req, res, _next) => {
      const status = httpStatus.INTERNAL_SERVER_ERROR;

      console.error("Request/Response Error", error);
      res.status(status).json(error);
    });
  }

  setupLogs(router) {
    if (process.env.NODE_ENV === "test") return;
    
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
