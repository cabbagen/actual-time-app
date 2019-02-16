// 通知消息借用全局的 im_global_notice 统一处理 
// 由客户端决定使用与否

const { EventCenter, NoticeEventCenter } = require('../events/chat.event');
const { ContactService } = require('../database/chat.contacts');
const { NoticeService } = require('../database/chat.notices');
const channels = require('../channels/chat.channel');

// 添加好友用户通知
// 判断用户当前是否在线
// 在线：   消息通知
// 不在线： 将消息存至数据库  =>  当用户登录后，需要进行通知，并修改消息状态
async function handleImAddFriend(socket, noticeInfo) {
  const isOnLine = await ContactService.getContactIsOnLine(noticeInfo.appkey, noticeInfo.target_contact_id);

  // 记录至数据库
  if (isOnLine === 0) {
    NoticeService.createAddFriendNotice(noticeInfo.appkey, noticeInfo);
    return;
  }

  // 广播添加好友消息
  socket.to(channels.im_global_notice).emit(EventCenter.im_notice, noticeInfo);
}

const noticeHandleMap = {
  [NoticeEventCenter.im_notice_add_friend]: handleImAddFriend,
};

exports.handleIMNotice = function(socket, noticeInfo) {
  noticeHandleMap[noticeInfo.notice_type](socket, noticeInfo);
}
