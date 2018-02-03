const svgCaptcha = require('svg-captcha');

/**
 * 生成默认的验证码
 * @param {Object} options - 生成验证码的配置参数
 * @return {Object} captcha - 返回验证码信息
 */
function generateDefaultCaptcha(options = {}) {
  const captcha = svgCaptcha.create(options);
  return captcha;
}

/**
 * 生成数学表达式的验证码
 * @param {Object} options - 生成验证码的配置参数
 * @return {Object} captcha - 返回验证码信息
 */
function generateMathExprCaptcha(options = {}) {
  const captcha = svgCaptcha.createMathExpr(options);
  return captcha;
}

module.exports = {
  generateDefaultCaptcha,
  generateMathExprCaptcha,
};
