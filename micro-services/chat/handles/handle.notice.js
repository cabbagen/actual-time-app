// 通知消息借用全局的 im_global_notice 统一处理 
// 由客户端决定使用与否

const { EventCenter, NoticeEventCenter } = require('../index');
const { ContactsService } = require('../services/contacts.service');
const { NoticesService } = require('../services/notices.service');
const { GroupsService } = require('../services/groups.service');

/**
 * 添加好友用户通知
 * 判断用户当前是否在线
 * 在线：   消息通知
 * 不在线： 将消息存至数据库  =>  当用户登录后，需要进行通知，并修改消息状态
 * 
 * @param {Object} socket 
 * @param {Object} noticeInfo 
 */
async function handleImAddFriend(socket, noticeInfo) {
  const isOnLine = await ContactsService.getContactIsOnLine(noticeInfo.appkey, noticeInfo.target_contact_id);

  // 用户当前不在线，将消息记录至数据库
  if (!isOnLine) {
    NoticesService.createAddFriendNotice(noticeInfo.appkey, noticeInfo);
    return;
  }

  // 广播添加好友消息
  socket.to(NoticeEventCenter.im_global_notice).emit(EventCenter.im_notice, noticeInfo);
}

/**
 * 申请加群通知
 * 判断群组群主是否在线
 * 在线：   消息通知
 * 不在线   将消息存至数据库  =>  当用户登录后，需要进行通知，并修改消息状态
 * 
 * @param {Object} socket 
 * @param {Object} noticeInfo 
 */
async function handleImAddGroup(socket, noticeInfo) {
  const creatorInfoResult = await GroupsService.getGroupCreatorInfo(noticeInfo.appkey, noticeInfo.target_group_id);

  if (creatorInfoResult.error) {
    return;
  }

  const creatorInfo = creatorInfoResult.result;

  // 如果群主不在线
  if (creatorInfo.state === 0) {
    NoticesService.createAddGroupNotice(noticeInfo.appkey, noticeInfo, creatorInfo._id.toString());
    return;
  }

  socket.to(NoticeEventCenter.im_global_notice).emit(EventCenter.im_notice, Object.assign({}, noticeInfo, {
    target_contact_id: creatorInfo._id.toString(),
    target_contact_nickname: creatorInfo.nickname,
  }));
}

// 消息子类型处理
const noticeHandleMap = {
  [NoticeEventCenter.im_notice_add_friend]: handleImAddFriend,
  [NoticeEventCenter.im_notice_add_group]: handleImAddGroup,
};

exports.handleIMNotice = function(socket, noticeInfo) {
  noticeHandleMap[noticeInfo.notice_type](socket, noticeInfo);
}
