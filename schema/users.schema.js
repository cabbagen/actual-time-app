const mongoose = require('mongoose');
const cryptoProvider = require('../providers/crypto.provider.js');
const utilsProvider = require('../providers/utils.provider.js');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: { type: String, index: true, unique: true },
  password: String,
  provider: [Number],
  avator: String,
  email: { type: String, unique: true },
  extra: String,
  timestamp: { type: Date, default: Date.now },
  gender: Number,
  nickname: String,
  appKey: String,
});

usersSchema.statics.createUser = function(params, callback) {
  const realParams = Object.assign({}, params, {
    password: cryptoProvider.getSaledHashSync(params.password),
    appKey: utilsProvider.makeRandomAppkey(),
  });
  return this.create(realParams, callback);
}

module.exports = usersSchema;
