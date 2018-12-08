const EventCenter = {
  im_connection: 'connection',
  im_online: 'im_online',
  im_disconnecting: 'disconnecting',
  im_notice: 'im_notice',
  im_signal_chat: 'im_signal_chat',
  im_create_channel: 'im_create_channel',
};

const NoticeEventCenter = {
  im_notice_add_friend: 'im_notice_add_friend',
};

module.exports = { EventCenter, NoticeEventCenter };
