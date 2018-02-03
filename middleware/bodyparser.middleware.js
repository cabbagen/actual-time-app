const bodyParse = require('body-parser');

module.exports = {
  urlencoded: bodyParse.urlencoded({ extended: false }),
  json: bodyParse.json(),
};