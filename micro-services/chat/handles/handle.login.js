const { ContactService } = require('../database/chat.contacts');
const channels = require('../channels/chat.channel');

exports.handleIMLogin = function (socket, data) {
  // 重构 IM 登录部分，在用户登录时，将用户添加至所有相关的通道
  // 并加入 im_global_notice 通道
  // 主要用于 全局通知
  socket.join(channels.im_global_notice, () => {
    ContactService.loginIMService(data.appkey, data.id, socket.client.id);
  });
}
