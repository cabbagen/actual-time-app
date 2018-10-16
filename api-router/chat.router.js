const { registeRouter } = require('../kernel/core.js');
const ContactsApiController = require('../api/chat/contacts.api').init();
const GroupsApiController = require('../api/chat/groups.api').init();
const MessagesApiController = require('../api/chat/messages.api').init();

const apiRouterMap = {
  post: {
    // - contacts
    ['/api/createContactInfos']: ContactsApiController.createContactInfos.bind(ContactsApiController),
    ['/api/removeContactInfos']: ContactsApiController.removeContactInfos.bind(ContactsApiController),
    ['/api/getContactInfo']: ContactsApiController.getContactInfo.bind(ContactsApiController),
    ['/api/getContactRelatedInfo']: ContactsApiController.getContactRelatedInfo.bind(ContactsApiController),
    ['/api/getContactInfos']: ContactsApiController.getContactInfos.bind(ContactsApiController),
    ['/api/getContactUnReadMessages']: ContactsApiController.getContactUnReadMessages.bind(ContactsApiController),
    ['/api/getContactMessages']: ContactsApiController.getContactMessages.bind(ContactsApiController),

    // - groups
    ['/api/createGroupInfos']: GroupsApiController.createGroupInfos.bind(GroupsApiController),
    ['/api/removeGroupInfos']: GroupsApiController.removeGroupInfos.bind(GroupsApiController),
    ['/api/getGroupInfo']: GroupsApiController.getGroupInfo.bind(GroupsApiController),
    ['/api/getGroupInfos']: GroupsApiController.getGroupInfos.bind(GroupsApiController),
    ['/api/updateGroupInfo']: GroupsApiController.updateGroupInfo.bind(GroupsApiController),
    ['/api/getGroupMembers']: GroupsApiController.getGroupMembers.bind(GroupsApiController),
    ['/api/getGroupMessages']: GroupsApiController.getGroupMessages.bind(GroupsApiController),

    // - messages
    ['/api/addMessageInfos']: MessagesApiController.addMessageInfos.bind(MessagesApiController),
    ['/api/getMessageInfo']: MessagesApiController.getMessageInfo.bind(MessagesApiController),
    ['/api/removeMessages']: MessagesApiController.removeMessages.bind(MessagesApiController),
    ['/api/updateMessageInfo']: MessagesApiController.updateMessageInfo.bind(MessagesApiController),
  },
};

module.exports = registeRouter(apiRouterMap);
