const fs = require('fs');
const express = require('express');

function _getRouterFiles() {
  const controllerFiles = fs.readdirSync('./router/');
  return controllerFiles.map(filePath => `../router/${filePath}`);
}

function applicationInit(app, isAccrossHost) {
  if(isAccrossHost) {
    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      res.header('Access-Control-Allow-Credentials','true');
      next();
    });
  }
  const controllerFiles = _getRouterFiles();
  controllerFiles.forEach((filePath) => {
    const router = require(filePath);
    app.use(router.router);
  });
}

function registeRouter(routerMap) {
  const router = express.Router();
  for(const prop in routerMap) {
    for(const subProp in routerMap[prop]) {
      const hasRouteMiddleware = routerMap[prop][subProp] instanceof Array;
      if (hasRouteMiddleware) {
        const params = [subProp].concat(routerMap[prop][subProp]);
        router[prop].apply(router, params);
      } else {
        router[prop](subProp, routerMap[prop][subProp]);      
      }
    }
  }
  return { router };
}

function registeMiddleware(app, middlewares) {
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

module.exports = { applicationInit, registeRouter, registeMiddleware };
