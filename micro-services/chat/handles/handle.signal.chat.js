const { ContactService } = require('../database/chat.contacts');
const { MessageService } = require('../database/chat.messages');
const { ChannelService } = require('../database/chat.channels');
const { EventCenter } = require('../events/chat.event');

exports.handleIMSignalChat = async function(socket, data) {
  const targetContactState = await ContactService.getContactIsOnLine(data.appkey, data.target);
  const channelInfo = await ChannelService.getChannelInfoBySourceIdAndTargetId(data.source, data.target);
  const savedMessageInfo = await MessageService.saveIMMessage(data.appkey, targetContactState, 2, data);
  const completedMessageInfo = await MessageService.getMessageInfoByMessageId(savedMessageInfo._id);

  socket
    .emit(EventCenter.im_signal_chat, completedMessageInfo)
    .to(channelInfo.channel_id)
    .emit(EventCenter.im_signal_chat, completedMessageInfo);
}