const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const contactsSchema = require('../schema/contacts.schema');

class ContactsModel extends BaseModel {

  static init() {
    return new ContactsModel();
  }

  constructor(props) {
    super(props);
    this.contactsModel = mongoose.model('contacts', contactsSchema);
  }

  async getContactRelatedInfo(condition, selected = {}, isFull = false) {
    if (!condition.appkey || !condition.id) {
      return { result: null, error: this.paramsError }
    }

    const where = { appkey: condition.appkey, _id: mongoose.Types.ObjectId(condition.id) };

    const result = isFull
      ? await this.contactsModel.findOne(where, selected).exec()
      : await this.contactsModel.findOne(where, selected).populate('friends').populate('groups').exec();

    return result;
  }

  async updateContactInfo(condition, updatedInfo) {
    if (!condition.appkey || !condition.id) {
      return { result: null, error: this.paramsError };
    }
    const where = { appkey: condition.appkey, _id: mongoose.Types.ObjectId(condition.id) };

    return await this.contactsModel.update(where, updatedInfo).exec().then(this.resolve).catch(this.reject);
  }

  async setContactStatusBySocketId(socketId, state) {
    if (typeof socketId === 'undefined') {
      return { result: null, error: this.paramsError };
    };

    return await this.contactsModel.update({ socket_id: socketId }, { state }).exec().then(this.resolve).catch(this.reject);
  }
}

module.exports = ContactsModel;
