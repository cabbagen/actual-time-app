const { SocketChatService } = require('./chat.socket');

const EventCenter = {
  im_connection: 'connection',
  im_online: 'im_online',
  im_disconnecting: 'disconnecting',
  im_notice: 'im_notice',
  im_signal_chat: 'im_signal_chat',
  im_create_channel: 'im_create_channel',
};

const NoticeEventCenter = {
  // 全局事件通知
  im_global_notice: 'im_global_notice',

  // 通知消息通知
  im_notice_add_friend: 'im_notice_add_friend',
  im_notice_remove_friend: 'im_notice_remove_friend',
  im_notice_add_group: 'im_notice_add_group',
  im_notice_remove_group: 'im_notice_remove_group',
  im_notice_disband_group: 'im_notice_disband_group',
};

module.exports = {
  SocketChatService, EventCenter, NoticeEventCenter
};
