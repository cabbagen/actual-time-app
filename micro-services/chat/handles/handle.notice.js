const { NoticeEventCenter, EventCenter } = require('../events/chat.event');
const { ChannelService } = require('../database/chat.channels');
const { ContactService } = require('../database/chat.contacts');
const channels = require('../channels/chat.channel');

async function createIMChannel(socket, data) {
  const { sourceId, targetId, appkey } = data;
  const targetInfo = await ContactService.getContactIsOnLine(appkey, targetId);

  ChannelService.createIMChannel(appkey, targetInfo.state, sourceId, targetId);

  const channelInfo = await ChannelService.getChannelInfoBySourceIdAndTargetId(sourceId, targetId);

  // 如果对方 IM 用户在线，要通知 IM 用户加入 IM 房间
  if (targetInfo.state === 1) {
    const sendNoticeInfo = {
      type: NoticeEventCenter.notice_join_room,
      data: { id: targetId, channel_id: channelInfo.channel_id },
    };
    socket.to(channels.im_global_notice).emit(EventCenter.im_notice, sendNoticeInfo);
  }

  // 将当前 IM 用户加入单聊房间
  joinChatRoom(socket, { id: sourceId, channel_id: channelInfo.channel_id });
}

function joinChatRoom(socket, data) {
  socket.join(data.channel_id, () => {
    console.log('以加入 单聊房间', data);
  });
}

const noticeHandleMap = {
  [NoticeEventCenter.notice_create_channel]: createIMChannel,
  [NoticeEventCenter.notice_join_room]: joinChatRoom,
};

exports.handleIMNotice = function(socket, noticeInfo) {
  console.log('接收到消息：', noticeInfo.data);
  console.log('\n============');
  const { type, data } = noticeInfo;
  noticeHandleMap[type](socket, data);
}
