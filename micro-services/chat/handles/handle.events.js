const { EventCenter } = require('../index');
const { handleIMLogin } = require('./handle.login');
const { handleIMLogout } = require('./handle.logout');
const { handleIMNotice } = require('./handle.notice');
const { handleIMSingleChat } = require('./handle.single.chat');
const { handleIMGroupChat } = require('./handle.group.chat');
const { handleChangeChannel } = require('./handle.channel');

const EventHandles = {
  [EventCenter.im_online]: handleIMLogin,
  [EventCenter.im_disconnecting]: handleIMLogout,
  [EventCenter.im_notice]: handleIMNotice,
  [EventCenter.im_single_chat]: handleIMSingleChat,
  [EventCenter.im_group_chat]: handleIMGroupChat,
  [EventCenter.im_create_channel]: handleChangeChannel,
};

const registEventHandle = function(socket) {
  for (const eventName in EventHandles) {
    socket.on(eventName, (data) => EventHandles[eventName](socket, data));
  }
}

module.exports = { EventHandles, registEventHandle };
