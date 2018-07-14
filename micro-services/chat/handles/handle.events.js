const { EventCenter } = require('../events/chat.event');
const { handleIMLogin } = require('./handle.login');
const { handleIMLogout } = require('./handle.logout');
const { handleIMNotice } = require('./handle.notice');

const EventHandles = {
  [EventCenter.im_online]: handleIMLogin,
  [EventCenter.im_disconnecting]: handleIMLogout,
  [EventCenter.im_notice]: handleIMNotice,
};

const registEventHandle = function(socket) {
  for (const eventName in EventHandles) {
    socket.on(eventName, (data) => EventHandles[eventName](socket, data));
  }
}

module.exports = { EventHandles, registEventHandle };
