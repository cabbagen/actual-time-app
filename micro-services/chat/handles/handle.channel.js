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
  const { appkey, sourceId, targetId, channelType } = message;
  const channelInfoResult = channelType === 1
    ? await ChannelsService.createSingleChannel(appkey, sourceId, targetId)
    : await ChannelsService.createGroupChannel(appkey, targetId);

  if (channelInfoResult.error) {
    return;
  }

  const channelInfo = channelInfoResult.result;
  const unReadedMessagesResult = await ChannelsService.getUnReadedChannelMessages(appkey, channelInfo.channel_id);

  if (unReadedMessagesResult.error) {
    return;
  }

  // 将未读消息置为已读
  await MessagesService.readChannelMessages(appkey, channelInfo.channel_id);

  const sendMessage = {
    channelId: channelInfo.channel_id,
    eventType: EventCenter.im_create_channel,
    data: unReadedMessageResult.result,
  };

  socket.emit(EventCenter.im_create_channel, sendMessage);
}


