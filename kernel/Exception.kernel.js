
const webExceptions = {

};

const chatExceptions = {
  1000: { code: 1000, message: 'ok', data: 'ok' },
  1001: { code: 1001, message: 'appkey 错误', data: null },
  1002: { code: 1002, message: '请求参数错误', data: null },
  1003: { code: 1003, message: '数据库响应错误', data: null },
};

class ExceptionKernel {
  constructor() {
    this.exceptions = { web: webExceptions, chat: chatExceptions };
  }
}

ExceptionKernel.web = 'web';

ExceptionKernel.chat = 'chat';


module.exports = ExceptionKernel;
