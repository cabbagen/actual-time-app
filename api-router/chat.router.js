const chatController = require('../controller/chat.controller.js').init();
const authMiddleware = require('../middleware/auth.middleware.js');
const { registeRouter } = require('../kernel/core.js');
const ContactsApiController = require('../api/chat/contacts.api').init();
const GroupsApiController = require('../api/chat/groups.api').init();

const apiRouterMap = {
  get: {
    ['/chatDemo']: [ authMiddleware(), chatController.renderChat.bind(chatController) ],
    ['/getContactInfo']: chatController.getContactInfo.bind(chatController),
  },
  post: {
    ['/saveContactInfo']: chatController.saveContactInfo.bind(chatController),
    ['/getContactInfos']: chatController.getContactInfos.bind(chatController),


    // - contacts
    ['/api/createContactInfos']: ContactsApiController.createContactInfos.bind(ContactsApiController),
    ['/api/removeContactInfos']: ContactsApiController.removeContactInfos.bind(ContactsApiController),
    ['/api/getContactInfo']: ContactsApiController.getContactInfo.bind(ContactsApiController),
    ['/api/getContactRelatedInfo']: ContactsApiController.getContactRelatedInfo.bind(ContactsApiController),
    ['/api/getContactInfos']: ContactsApiController.getContactInfos.bind(ContactsApiController),
    ['/api/getContactUnReadMessages']: ContactsApiController.getContactUnReadMessages.bind(ContactsApiController),

    // - groups
    ['/api/createGroupInfos']: GroupsApiController.createGroupInfos.bind(GroupsApiController),
    ['/api/removeGroupInfos']: GroupsApiController.removeGroupInfos.bind(GroupsApiController),
    ['/api/getGroupInfo']: GroupsApiController.getGroupInfo.bind(GroupsApiController),
    ['/api/getGroupInfos']: GroupsApiController.getGroupInfos.bind(GroupsApiController),
    ['/api/updateGroupInfo']: GroupsApiController.updateGroupInfo.bind(GroupsApiController),
    ['/api/getGroupMembers']: GroupsApiController.getGroupMembers.bind(GroupsApiController),
    ['/api/getGroupMessages']: GroupsApiController.getGroupMessages.bind(GroupsApiController),

    // - messages

  },
};

module.exports = registeRouter(apiRouterMap);
