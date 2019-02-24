const { ContactsService } = require('../services/contacts.service');
const { ChannelsService } = require('../services/channels.service');
const { MessagesService } = require('../services/messages.service');
const { EventCenter } = require('../index');

exports.handleIMSignalChat = async function(socket, message) {
  const { appkey, source, target } = message;

  // 判断对方是否在线， 决定消息 已读 or 未读
  const targetIsOnLine = await ContactsService.getContactIsOnLine(appkey, target);

  const channelInfoResult = await ChannelsService.getChannelInfoBySourceIdAndTargetId(appkey, source, target);

  if (channelInfoResult.error) {
    return;
  }

  const channelInfo = channelInfoResult.result;

  const saveMessageResult = await MessagesService.saveIMMessage(appkey, channelInfo, targetIsOnLine, 1, message);

  if (saveMessageResult.error) {
    return;
  }

  // 带有完整信息的消息对象
  const fullMessageInfoResult = await MessagesService.getFullMessageInfoByMessageId(appkey, saveMessageResult.result._id.toString());

  if (fullMessageInfoResult.error) {
    return;
  }

  const fullMessageInfo = fullMessageInfoResult.result[0];

  socket
    .emit(EventCenter.im_signal_chat, fullMessageInfo)
    .to(channelInfo.channel_id)
    .emit(EventCenter.im_signal_chat, fullMessageInfo);
}