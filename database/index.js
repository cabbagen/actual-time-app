const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('./config.js');

/**
 * load models after connect mongoose
 * for the `ref` used on schema 
 */
function loadModels() {
  require('../model/contacts.model');
  require('../model/groups.model');
  require('../model/messages.model');
  require('../model/users.model');
}

module.exports = function databaseInit() {
  mongoose.connect(`${config.host}/${config.dbname}`, { useMongoClient: true });

  loadModels();

  mongoose.Promise = bluebird;
  const db = mongoose.connection;

  db.on('error', function() {
    console.log('connect error');
  });
  db.on('open', function() {
    console.log('connect ok');
  });

}