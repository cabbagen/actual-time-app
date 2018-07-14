const EventCenter = {
  im_connection: 'connection',
  im_online: 'im_online',
  im_disconnecting: 'disconnecting',
  im_notice: 'im_notice',
  im_signal_chat: 'im_signal_chat',
};

const NoticeEventCenter = {
  notice_create_channel: 'notice_create_channel',
};

module.exports = { EventCenter, NoticeEventCenter };
