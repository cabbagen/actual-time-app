const { NoticeEventCenter } = require('../events/chat.event');

const noticeHandleMap = {
  [NoticeEventCenter.im_notice_add_friend]: function(sokcet, noticeInfo) {
    console.log(noticeInfo);
  }
};

exports.handleIMNotice = function(socket, noticeInfo) {
  noticeHandleMap[noticeInfo.notice_type](socket, noticeInfo);
}
