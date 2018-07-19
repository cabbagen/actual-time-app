const { ChannelService } = require('../database/chat.channels');
const { ContactService } = require('../database/chat.contacts');

exports.handleCreateChannel = async function(socket, data) {
  const { sourceId, targetId, appkey } = data;
  const targetInfo = await ContactService.getContactIsOnLine(appkey, targetId);

  ChannelService.resetIMChannel(sourceId, targetId);
  ChannelService.createIMChannel(appkey, targetInfo.state, sourceId, targetId);
}
