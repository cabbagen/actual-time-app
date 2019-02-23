const NoticeModel = require('../../../model/notices.model').init();

class NoticeService {

  async createAddFriendNotice(appkey, noticeInfo) {
    const notice = {
      notice_type : 1,
      source_contact_id : noticeInfo.source_contact_id,
      target_contact_id : noticeInfo.target_contact_id,
      target_group_id : null,
      notice_text : `${noticeInfo.source_contact_nickname}请求添加你为好友`,
    };

    return await NoticeModel.createNoticeInfos(appkey, [notice]);
  }

  async createAddGroupNotice(appkey, noticeInfo, creatorId) {
    const notice = {
      notice_type: 2,
      source_contact_id: noticeInfo.source_contact_id,
      target_contact_id: creatorId,
      target_group_id: noticeInfo.target_group_id,
      notice_text: `${noticeInfo.source_contact_nickname}请求加入${noticeInfo.target_group_name}`
    }

    return await NoticeModel.createNoticeInfos(appkey, [notice]);
  }
}

module.exports = {
  NoticeService: new NoticeService(),
};
