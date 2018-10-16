const BaseApiController = require('../base.api');
const MessageModel = require('../../model/messages.model').init();
const utils = require('../../providers/utils.provider');

class MessageApiController extends BaseApiController {

  static init() {
    return new MessageApiController();
  }

  // 创建聊天信息
  async addMessageInfos(request, response) {
    const { appkey, messageInfos } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(messageInfos) !== 'Array') {
      return response.json(this.exceptions['1002']);
    }

    const result = await MessageModel.addMessageInfos(appkey, messageInfos);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(this.exceptions['1000']);
  }

  // 查询聊天信息详情
  async getMessageInfo(request, response) {
    const { appkey, messageId } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(messageId) !== 'String') {
      return response.json(this.exceptions['1002']);
    }

    const result = await MessageModel.getMessageInfo(appkey, messageId);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(Object.assign({}, this.exceptions['1000'], { data: result.result }));
  }

  // 删除聊天信息
  async removeMessages(request, response) {
    const { appkey, messageIds } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(messageIds) !== 'Array') {
      return response.json(this.exceptions['1002']);
    }

    const result = await MessageModel.removeMessages(appkey, messageIds);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(this.exceptions['1000']);
  }

  // 更新聊天信息记录
  async updateMessageInfo(request, response) {
    const { appkey, messageId, messageInfo } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(messageId) !== 'String' || utils.checkType(messageInfo) !== 'Object') {
      return response.json(this.exceptions['1002']);
    }

    const result = await MessageModel.updateMessageInfo(appkey, messageId, messageInfo);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(this.exceptions['1000']);
  }
}

module.exports = MessageApiController;
