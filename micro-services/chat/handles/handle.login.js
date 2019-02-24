const { ContactsService } = require('../services/contacts.service');
const { ChannelsService } = require('../services/channels.service');
const { NoticeEventCenter } = require('../index');

exports.handleIMLogin = async function (socket, data) {
  // 重构 IM 登录部分，在用户登录时，将用户添加至所有相关的通道
  // 并加入 im_global_notice 通道
  // 主要用于 全局通知
  const relatedChannels = await ChannelsService.getContactRelatedChannelIds(data.appkey, data.id) || [];

  socket.join([...relatedChannels, NoticeEventCenter.im_global_notice], () => {
    ContactsService.loginIMService(data.appkey, data.id, socket.client.id);
  });
}
