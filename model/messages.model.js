const mongoose = require('mongoose');
const moment = require('moment');
const BaseModel = require('./base.model');
const utils = require('../providers/utils.provider');
const messagesSchema = require('../schema/messages.schema');

class MessagesModel extends BaseModel {

  static init() {
    return new MessagesModel();
  }

  constructor(props) {
    super(props);
    this.messagesModel = mongoose.model('messages', messagesSchema);
  }

  /**
   * 添加消息
   * @param {String} appkey 
   * @param {Object[]} messages 
   */
  async addMessages(appkey, messages) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(messages) !== 'Array') {
      return { result: null, error: this.paramsError };
    }

    const messageInfos = messages.map((message) => {
      return Object.assign({}, message, { appkey });
    });

    return this.messagesModel.create(messageInfos).then(this.resolve).catch(this.reject);
  }

  /**
   * 获取消息列表
   * @param {String} appkey 
   * @param {Object} condition 
   */
  async getMessages(appkey, condition) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(condition) !== 'Array') {
      return { result: null, error: this.paramsError };
    }

    const realCondition = Object.assign({}, condition, { appkey });

    return this.messagesModel.find(realCondition).populate('message_source').populate('message_target').exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 更新指定条件的多条信息
   * @param {String} appkey 
   * @param {Object} condition 
   * @param {Object} updatedInfo 
   */
  async updateMessages(appkey, condition, updatedInfo) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(condition) !== 'Object' || utils.checkType(updatedInfo) !== 'Object') {
      return { result: null, error: this.paramsError };
    }

    const realCondition = Object.assign({}, condition, { appkey });
    
    return this.messagesModel.update(realCondition, updatedInfo, { multi: true }).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 删除消息记录
   * @param {String} appkey 
   * @param {String[]} messageIds 
   */
  async removeMessages(appkey, messageIds) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(messageIds) !== 'Array') {
      return { result: null, error: this.paramsError };
    }

    const realMessageIds = messageIds.map(messageId => mongoose.Types.ObjectId(messageId));

    return this.messagesModel.deleteMany({ appkey, _id: { $in: realMessageIds } }).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 获取 IM 用户的未读消息
   * @param {String} appkey 
   * @param {String} contactId 
   */
  async getContactUnReadMessages(appkey, contactId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(contactId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    return this.messagesModel.aggregate([
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
    .exec()
    .then(this.resolve)
    .catch(this.reject);
  }

  /**
   * 获取 IM 用户聊天记录
   * @param {String} appkey 
   * @param {String} fromContactId 
   * @param {String} toContactId 
   * @param {Object} condition 
   */
  async getContactMessages(appkey, fromContactId, toContactId, condition) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(fromContactId) !== 'String' || utils.checkType(toContactId) !== 'String' || utils.checkType(condition) !== 'Object') {
      return { result: null, error: this.paramsError };
    }

    const searchCondition = {
      appkey,
      message_source: mongoose.Types.ObjectId(fromContactId),
      message_target: mongoose.Types.ObjectId(toContactId),
    };

    if (condition.startTime && condition.endTime) {
      searchCondition.created_at = {
        $gt: new Date(moment(condition.startTime).toISOString()),
        $lt: new Date(moment(condition.endTime).toISOString()),
      };
    }
    return this.messagesModel.find(searchCondition).skip(condition.pageSize * condition.pageIndex).limit(condition.pageSize).then(this.resolve).catch(this.reject);
  }

  /**
   * 获取群组消息记录
   * @param {String} appkey 
   * @param {String} groupId
   * @param {Object} condition 
   */
  async getGroupMessages(appkey, groupId, condition) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(groupId) !== 'String' || utils.checkType(condition) !== 'Object') {
      return { result: null, error: this.paramsError };
    }

    const searchCondition = { appkey, message_channel: groupId };

    if (condition.startTime && condition.endTime) {
      searchCondition.created_at = {
        $gt: new Date(moment(condition.startTime).toISOString()),
        $lt: new Date(moment(condition.endTime).toISOString()),
      };
    }
    return this.messagesModel.find(searchCondition).skip(condition.pageSize * condition.pageIndex).limit(condition.pageSize).then(this.resolve).catch(this.reject);
  }
}

module.exports = MessagesModel;
