const { MessagesService } = require('../services/messages.service');
const { EventCenter } = require('../index');

exports.handleIMGroupChat = async function(socket, message) {
  const { appkey, target } = message;
  const saveMessageResult = await MessagesService.saveIMGroupMessage(appkey, target, message);

  if (saveMessageResult.error) {
    console.error(saveMessageResult.error);
    return;
  }

  const savedMessage = saveMessageResult.result[0];

  const fullMessageInfoResult = await MessagesService.getFullMessageInfoByMessageId(appkey, savedMessage._id.toString());

  if (fullMessageInfoResult.error) {
    console.error(fullMessageInfoResult.error);
    return;
  }

  const fullMessageInfo = fullMessageInfoResult.result[0];

  socket
    .emit(EventCenter.im_group_chat, fullMessageInfo)
    .to(target)
    .emit(EventCenter.im_group_chat, fullMessageInfo);
}