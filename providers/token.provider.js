const jwt = require('jwt-simple');
const moment = require('moment');
const utils = require('./utils.provider');

const secret = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

// token 有效时间为 30 minutes 
const expires = moment().add('minutes', 30).valueOf();

// 根据不同的子项目生成不同的 token
const tokenMap = {
  chat: { project: 'chat', expires: expires },
  document: { project: 'document', expires: expires },
  video: { project: 'video', expires: expires },
};

/**
 * 创建 token
 * @param {String} projectName - 项目名称
 * @return {Object|String} 如果生产 token 成功，返回 token 字符串，失败 则返回 null 
 */
function createToken(projectName) {
  const projectNames = Object.keys(tokenMap);
  if (projectNames.indexOf(projectName) > -1) {
    return jwt.encode(tokenMap[projectName], secret);  
  }
  return null;
}

/**
 * 验证子项目的 token
 * @param {String} projectName - 子项目名称
 * @param {String} token - 需要验证的 token
 * 
 * @return {Object} - status === 0 => ok, msg => 错误信息
 */
function validateToken(projectName, token) {
  if (utils.checkType(token) !== 'String') {
    return { status: 1, msg: '非法的 token' };
  }

  const decode = jwt.decode(token, secret);

  if (!decode) {
    return { status: 2, msg: '错误的 token' };
  }

  if (decode.expires < moment().valueOf()) {
    return { status: 3, msg: 'token 已失效, 请重新获取。' }
  }

  if (JSON.stringify(decode) !== JSON.stringify(tokenMap[projectName])) {
    return { status: 1, msg: '非法的 token' };
  }

  return { status: 0, msg: 'ok' };
}

module.exports = {
  createToken: createToken,
  validateToken: validateToken,
};