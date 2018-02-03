const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('./config.js');

module.exports = function databaseInit() {
  mongoose.connect(`${config.host}/${config.dbname}`, { useMongoClient: true });

  mongoose.Promise = bluebird;
  const db = mongoose.connection;

  db.on('error', function() {
    console.log('connect error');
  });
  db.on('open', function() {
    console.log('connect ok');
  });

}