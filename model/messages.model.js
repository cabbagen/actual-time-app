const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const messagesSchema = require('../schema/messages.schema');

class MessagesModel extends BaseModel {

  static init() {
    return new MessagesModel();
  }

  constructor(props) {
    super(props);
    this.messagesModel = mongoose.model('messages', messagesSchema);
  }

  async addMessage(message) {
    return await this.messagesModel.create(message).then(this.resolve).catch(this.reject);
  }

  async getMessages(condition) {
    return await this.messagesModel.find(condition)
      .populate('message_source')
      .populate('message_target')
      .exec()
  }

  async updateMessages(condition, updatedInfo) {
    return await this.messagesModel.update(condition, updatedInfo, { multi: true })
      .exec()
      .then(this.resolve)
      .catch(this.reject);
  }

  async getRecentContactMessages(contactId) {
    return await this.messagesModel.aggregate([
      {
        $match: {
          $or: [
            { message_source: mongoose.Types.ObjectId(contactId) },
            { message_target: mongoose.Types.ObjectId(contactId) },
          ],
          message_state: 0,
        }
      },
      {
        $group: {
          _id: '$message_channel',
          last_message: { $last: '$message_content' },
          last_target: { $last: '$message_target' },
          last_target_group: { $last: '$message_target_group' },
          last_source: { $last: '$message_source' },
          last_time: { $last: '$created_at' },
          total: { $sum: 1 }
        }
      },
      {
        $lookup: { from: 'contacts', localField: 'last_target', foreignField: '_id', as: 'last_target' }
      },
      {
        $lookup: { from: 'contacts', localField: 'last_source', foreignField: '_id', as: 'last_source' }
      },
      {
        $lookup: { from: 'groups', localField: 'last_target_group', foreignField: '_id', as: 'last_target_group' }
      }
    ])
    .exec();
  }
}

module.exports = MessagesModel;
