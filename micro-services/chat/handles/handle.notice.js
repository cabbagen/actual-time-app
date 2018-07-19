// const { NoticeEventCenter, EventCenter } = require('../events/chat.event');
// const { ChannelService } = require('../database/chat.channels');
// const { ContactService } = require('../database/chat.contacts');

// async function createIMChannel(socket, data) {
//   const { sourceId, targetId, appkey } = data;
//   const targetInfo = await ContactService.getContactIsOnLine(appkey, targetId);

//   ChannelService.createIMChannel(appkey, targetInfo.state, sourceId, targetId);
// }

// const noticeHandleMap = {
//   [NoticeEventCenter.notice_create_channel]: createIMChannel,
// };

// exports.handleIMNotice = function(socket, noticeInfo) {
//   noticeHandleMap[noticeInfo.type](socket, noticeInfo.data);
// }
