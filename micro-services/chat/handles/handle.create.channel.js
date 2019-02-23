const { ChannelService } = require('../database/chat.channels');
const { ContactService } = require('../database/chat.contacts');
const { MessageService } = require('../database/chat.messages');
const { EventCenter } = require('../events/chat.event');

// 创建单聊的聊天通道
// 单聊的聊天通道为 [sourceId]@[targetId]
async function createSingleChannel(socket, data) {
  const { sourceId, targetId, appkey } = data;
  const targetIsOnLine = await ContactService.getContactIsOnLine(appkey, targetId);
  const unReadMessages = await MessageService.getSignalUnreadMessages(appkey, sourceId, targetId);

  // 重置之前的聊天通道
  // 因为 IM 用户同时只能和 一个 IM 聊天，所以这里没问题
  ChannelService.resetIMChannel(appkey, sourceId, targetId);

  // 开启新的聊天通道
  ChannelService.createIMChannel(appkey, targetIsOnLine, sourceId, targetId);

  // 如果当前的人有未读的消息，需要把这些消息设置为 `已读`，并把他们返回
  const channelInfo = await ChannelService.getChannelInfoBySourceIdAndTargetId(appkey, sourceId, targetId);

  const sendData = {
    channelId: channelInfo.channel_id,
    eventType: EventCenter.im_create_channel,
    data: unReadMessages,
  };

  MessageService.readMessages(appkey, channelInfo.channel_id);
  socket.emit(EventCenter.im_create_channel, sendData);
}

// 创建群聊通道
async function createGroupChannel(socket, data) {
  const { targetId, appkey } = data;
  const unReadMessages = await MessageService.getGroupHistoryMessages(appkey, targetId);

  ChannelService.createIMGroupChannel(appkey, targetId);

  const channelInfo = await ChannelService.getChannelInfoBtChannelId(appkey, targetId);

  const sendData = {
    channelId: channelInfo.channel_id,
    eventType: EventCenter.im_create_channel,
    data: unReadMessages,
  };

  MessageService.readMessages(channelInfo.channel_id);
  socket.emit(EventCenter.im_create_channel, sendData);
}

exports.handleCreateChannel = async function(socket, data) {
  if (data.channelType = 1) {
    createSingleChannel(socket, data);
    return;
  }

  createGroupChannel(socket, data);
}
