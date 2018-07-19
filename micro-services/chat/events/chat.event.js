const EventCenter = {
  im_connection: 'connection',
  im_online: 'im_online',
  im_disconnecting: 'disconnecting',
  im_notice: 'im_notice',
  im_signal_chat: 'im_signal_chat',
  im_create_channel: 'im_create_channel',
};

const NoticeEventCenter = {
  notice_create_channel: 'notice_create_channel',
  notice_join_room: 'notice_join_room',
};

module.exports = { EventCenter, NoticeEventCenter };
