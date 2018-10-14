const fs = require('fs');
const express = require('express');

class ApplicationCore {
  init(app, isAccrossHost) {
    const webRouterFiles = this.getRouterFiles('web-router');
    const apiRouterFiles = this.getRouterFiles('api-router');

    if (isAccrossHost) {
      this.allowAccrossHost(app);
    }
    webRouterFiles.concat(apiRouterFiles).forEach((filePath) => {
      const router = require(filePath);
      app.use(router.router);
    });
  }

  allowAccrossHost(app) {
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
      res.header('Access-Control-Allow-Credentials','true');
      next();
    });
  }

  getRouterFiles(routerDirName) {
    const routerFiles = fs.readdirSync(`./${routerDirName}/`);
    return routerFiles ? routerFiles.map(filePath => `../${routerDirName}/${filePath}`) : [];
  }

  registeRouter(routerMap) {
    const router = express.Router();
    for(const prop in routerMap) {
      for(const subProp in routerMap[prop]) {
        const hasRouteMiddleware = routerMap[prop][subProp] instanceof Array;
        hasRouteMiddleware ? router[prop](subProp, ...routerMap[prop][subProp]) : router[prop](subProp, routerMap[prop][subProp]);
      }
    }
    return { router };
  }

  registeMiddleware(app, middlewares) {
    // register normal middleware
    const normalMiddlewares = [];
    for(let prop in middlewares.normal) {
      normalMiddlewares.push(middlewares.normal[prop]);
    }
    // register special middleware => you need set `app` with the function's param and invoke it;
    const specialMiddlewares = [];
    for(let prop in middlewares.custom) {
      specialMiddlewares.push( middlewares.custom[prop](app) );
    }
    
    app.use(normalMiddlewares, specialMiddlewares);
  }
}

const application = new ApplicationCore();

module.exports = {
  applicationInit: application.init.bind(application),
  registeRouter: application.registeRouter.bind(application),
  registeMiddleware: application.registeMiddleware.bind(application),
};
