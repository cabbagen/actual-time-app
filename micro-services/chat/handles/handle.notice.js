// 通知消息借用全局的 im_global_notice 统一处理 
// 由客户端决定使用与否

const { EventCenter, NoticeEventCenter } = require('../events/chat.event');
const { ContactService } = require('../database/chat.contacts');
const { NoticeService } = require('../database/chat.notices');
const { GroupService } = require('../database/chat.groups');

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

// 申请加群通知
// 判断群组群主是否在线
// 在线：   消息通知
// 不在线   将消息存至数据库  =>  当用户登录后，需要进行通知，并修改消息状态
async function handleImAddGroup(socket, noticeInfo) {
  const creatorResult = await GroupService.getGroupCreatorInfo(noticeInfo.appkey, noticeInfo.target_group_id);

  if (creatorResult.error) {
    return;
  }

  const creatorInfo = creatorResult.result;

  // 如果群主不在线
  if (creatorInfo.state === 0) {
    NoticeService.createAddGroupNotice(noticeInfo.appkey, noticeInfo, creatorInfo._id.toString());
    return;
  }

  // 广播添加群组
  socket.to(channels.im_global_notice).emit(EventCenter.im_notice, Object.assign({}, noticeInfo, {
    target_contact_id: creatorInfo._id.toString(),
    target_contact_nickname: creatorInfo.nickname,
  }));
}

const noticeHandleMap = {
  [NoticeEventCenter.im_notice_add_friend]: handleImAddFriend,
  [NoticeEventCenter.im_notice_add_group]: handleImAddGroup,
};

exports.handleIMNotice = function(socket, noticeInfo) {
  noticeHandleMap[noticeInfo.notice_type](socket, noticeInfo);
}
