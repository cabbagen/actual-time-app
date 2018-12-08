const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const noticesSchema = require('../schema/notices.schema');

class NoticesModel extends BaseModel {
  static init() {
    return new NoticesModel();
  }

  constructor(props) {
    super(props);
    this.noticesModel = mongoose.model('notices', noticesSchema);
  }
}

module.exports = NoticesModel;
