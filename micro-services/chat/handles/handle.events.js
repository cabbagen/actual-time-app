const { EventCenter } = require('../events/chat.event');
const { handleIMLogin } = require('./handle.login');
const { handleIMLogout } = require('./handle.logout');
// const { handleIMNotice } = require('./handle.notice');
const { handleIMSignalChat } = require('./handle.signal.chat');
const { handleCreateChannel } = require('./handle.create.channel');

const EventHandles = {
  [EventCenter.im_online]: handleIMLogin,
  [EventCenter.im_disconnecting]: handleIMLogout,
  // [EventCenter.im_notice]: handleIMNotice,
  [EventCenter.im_signal_chat]: handleIMSignalChat,
  [EventCenter.im_create_channel]: handleCreateChannel,
};

const registEventHandle = function(socket) {
  for (const eventName in EventHandles) {
    socket.on(eventName, (data) => EventHandles[eventName](socket, data));
  }
}

module.exports = { EventHandles, registEventHandle };
