const chatController = require('../controller/chat.controller.js').init();
const { registeRouter } = require('../kernel/core.js');

const chatRouterMap = {
  get: {
    ['/getContactInfo']: chatController.getContactInfo.bind(chatController),
  },
  post: {
    ['/saveContactInfo']: chatController.saveContactInfo.bind(chatController),
    ['/getContactInfos']: chatController.getContactInfos.bind(chatController),
    ['/getGroupInfos']: chatController.getGroupInfos.bind(chatController),
    ['/createContactFriend']: chatController.createContactFriend.bind(chatController),
  },
};

module.exports = registeRouter(chatRouterMap);