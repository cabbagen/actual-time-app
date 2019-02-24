/**
 * 当用户选择聊天联系人的时候
 * 会根据聊天类型改变当前的聊天 channel
 * 消息类型  channelType    1 => 单聊    2 => 群聊
 * 单聊     channel_id =>  `${souceId}@@${targetId}`
 * 群聊     channel_id =>  `${groupId}`
 */

const { ChannelsService } = require('../services/channels.service');
const { MessagesService } = require('../services/messages.service');
const { EventCenter } = require('../index');

exports.handleChangeChannel = async function(socket, message) {
  const { channelType } = message;

  if (channelType === '1') {
    handleSingleChangeChannel(socket, message);
    return;
  }

  handleGroupChangeChannel(socket, message);
}

async function handleSingleChangeChannel(socket, message) {
  const { appkey, sourceId, targetId } = message;
  const channelInfoResult = await ChannelsService.createSingleChannel(appkey, sourceId, targetId);

  if (channelInfoResult.error) {
    console.error(fullMessageInfoResult.error);
    return;
  }

  const channelInfo = channelInfoResult.result;
  const unReadedMessagesResult = await MessagesService.getUnReadedChannelMessages(appkey, channelInfo.channel_id);

  if (unReadedMessagesResult.error) {
    console.error(fullMessageInfoResult.error);
    return;
  }

  // 将未读消息置为已读
  await MessagesService.readChannelMessages(appkey, channelInfo.channel_id);

  const sendMessage = {
    channelId: channelInfo.channel_id,
    eventType: EventCenter.im_create_channel,
    data: unReadedMessagesResult.result,
  };

  socket.emit(EventCenter.im_create_channel, sendMessage);
}

async function handleGroupChangeChannel(socket, message) {
  const { appkey, targetId } = message;
  const channelInfoResult = await ChannelsService.createGroupChannel(appkey, targetId);

  if (channelInfoResult.error) {
    console.error(fullMessageInfoResult.error);
    return;
  }

  const channelInfo = channelInfoResult.result;

  const historyMessagesResult = await MessagesService.getChannelHistoryMessages(appkey, channelInfo.channel_id);

  if (historyMessagesResult.error) {
    console.error(historyMessagesResult.error);
    return;
  }

  const sendMessage = {
    channelId: channelInfo.channel_id,
    eventType: EventCenter.im_create_channel,
    data: historyMessagesResult.result,
  };

  socket.emit(EventCenter.im_create_channel, sendMessage);
}

