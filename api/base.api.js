const ExceptionKernel = require('../kernel/Exception.kernel');

const exceptionInstance = new ExceptionKernel();

class BaseApiController {
  constructor() {
    this.exceptions = exceptionInstance.exceptions[ExceptionKernel.chat];
  }
}

module.exports = BaseApiController;
