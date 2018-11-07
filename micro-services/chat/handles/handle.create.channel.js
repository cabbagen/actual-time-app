const { ChannelService } = require('../database/chat.channels');
const { ContactService } = require('../database/chat.contacts');
const { MessageService } = require('../database/chat.messages');
const { EventCenter } = require('../events/chat.event');

exports.handleCreateChannel = async function(socket, data) {
  const { sourceId, targetId, appkey } = data;
  const targetIsOnLine = await ContactService.getContactIsOnLine(appkey, targetId);
  const unReadMessages = await MessageService.getSignalUnreadMessages(sourceId, targetId);

  // 重置之前的聊天通道
  // 因为 IM 用户同时只能和 一个 IM 聊天，所以这里没问题
  ChannelService.resetIMChannel(sourceId, targetId);

  // 开启新的聊天通道
  ChannelService.createIMChannel(appkey, targetIsOnLine, sourceId, targetId);

  // 如果当前的人有未读的消息，需要把这些消息设置为 `已读`，并把他们返回
  const channelInfo = await ChannelService.getChannelInfoBySourceIdAndTargetId(sourceId, targetId);

  const sendData = {
    channelId: channelInfo.channel_id,
    eventType: EventCenter.im_create_channel,
    data: unReadMessages,
  };

  MessageService.readMessages(channelInfo.channel_id);
  socket.emit(EventCenter.im_create_channel, sendData);
}
