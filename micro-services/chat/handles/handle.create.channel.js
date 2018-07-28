const { ChannelService } = require('../database/chat.channels');
const { ContactService } = require('../database/chat.contacts');
const { MessageService } = require('../database/chat.messages');
const { EventCenter } = require('../events/chat.event');

exports.handleCreateChannel = async function(socket, data) {
  const { sourceId, targetId, appkey } = data;
  const targetInfo = await ContactService.getContactIsOnLine(appkey, targetId);
  const unReadMessages = await MessageService.getSignalUnreadMessages(sourceId, targetId);
  // 重置之前的聊天通道
  ChannelService.resetIMChannel(sourceId, targetId);

  // 开启新的聊天通道
  ChannelService.createIMChannel(appkey, targetInfo.state, sourceId, targetId);

  // 如果当前的人有未读的消息，需要把这些消息设置为 `已读`，并把他们返回
  const channelInfo = await ChannelService.getChannelInfoBySourceIdAndTargetId(sourceId, targetId);
  const sendData = { channelId: channelInfo.channel_id, eventType: EventCenter.im_create_channel, data: unReadMessages };

  socket.emit(EventCenter.im_create_channel, sendData);
}
