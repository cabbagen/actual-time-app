const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * 加盐加密函数
 * @param {String} password
 * @return {Promise}
 */
function getSaledHash(password) {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * 同步加盐加密函数
 * @param {String} password
 * @return {String}
 */
function getSaledHashSync(password) {
  return bcrypt.hashSync(password, SALT_ROUNDS);
}

/**
 * 校验比较密码
 * @param {String} password 明文密码 
 * @param {String} hash 加密过的 hash 值
 * @return {Promise}
 */
function compareSaledHash(password, hash) {
  return bcrypt.compare(password, hash)
}

/**
 * 同步校验比较密码
 * @param {String} password 明文密码 
 * @param {String} hash 加密过的 hash 值
 * @return {Blooen}
 */
function compareSaledHashSync(password, hash) {
  return bcrypt.compareSync(password, hash)
}

module.exports = {
  getSaledHash,
  getSaledHashSync,
  compareSaledHash,
  compareSaledHashSync,
};