/**
 * 这里是一些公共的函数
 */

/**
 * 检验变量类型
 * @param {Any} param - 需要检验类型的变量
 * @return {Any}
 */
function checkType(param) {
  return Object.prototype.toString.call(param).slice(8, -1);
}

/**
 * 获取指定范围的随机数字
 * @param {Number} min - 随机数最小值
 * @param {Number} max - 随机数最大值
 * @return {Number}
 */
function getRandomRange(min, max) {
  if (checkType(min) !== 'Number' || checkType(max) !== 'Number') {
    throw new Error('获取制定范围的随机数字，这里的参数应该为数字');
  }
  return Math.round(Math.random() * (max - min)) + min;
}

/**
 * 生成随机的 appkey ，调用功能服务的 appkey
 * @return {String} appkey
 */
function makeRandomAppkey() {
  const letters = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
  ];
  const appkeyLen = 20;

  let appkey = '';

  for (let i = 0; i < appkeyLen; i++) {
    appkey += letters[getRandomRange(0, 61)];
  }

  return appkey;

}

module.exports = {
  checkType,
  getRandomRange,
  makeRandomAppkey
};
