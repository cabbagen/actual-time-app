const { ContactService } = require('../database/chat.contacts');
const { MessageService } = require('../database/chat.messages');
const { ChannelService } = require('../database/chat.channels');
const { EventCenter } = require('../events/chat.event');

exports.handleIMSignalChat = async function(socket, data) {
  const targetContactStateInfo = await ContactService.getContactIsOnLine(data.appkey, data.target);
  const channelInfo = await ChannelService.getChannelInfoBySourceIdAndTargetId(data.source, data.target);
  const messageInfo = await MessageService.saveIMMessage(data.appkey, targetContactStateInfo.state, 2, data);
    
  socket
    .emit(EventCenter.im_signal_chat, messageInfo)
    .to(channelInfo.channel_id)
    .emit(EventCenter.im_signal_chat, messageInfo);
}