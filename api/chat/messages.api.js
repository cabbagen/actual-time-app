const BaseApiController = require('../base.api');
const MessageModel = require('../../model/messages.model').init();
const utils = require('../../providers/utils.provider');

class MessageApiController extends BaseApiController {

  // 创建聊天信息
  async addMessages(request, response) {

  }

  // 

}

module.exports = MessageApiController;
