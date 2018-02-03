const bodyparser = require('./bodyparser.middleware.js');
const session = require('./session.middleware.js');


module.exports = {
  normal: {
    urlencoded: bodyparser.urlencoded,
    json: bodyparser.json,
  },
  custom: {
    session,
  }
};