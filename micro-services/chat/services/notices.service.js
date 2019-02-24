
/**
 * notices service
 * 提供 im notices 的相关操作
 */

const NoticeModel = require('../../../model/notices.model').init();

class NoticesService {

  /**
   * 创建添加好友的通知
   * @param {String} appkey 
   * @param {Object} noticeInfo 
   */
  async createAddFriendNotice(appkey, noticeInfo) {
    const notice = {
      notice_type : 1,
      source_contact_id : noticeInfo.source_contact_id,
      target_contact_id : noticeInfo.target_contact_id,
      target_group_id : "",
      notice_text : `${noticeInfo.source_contact_nickname}请求添加你为好友`,
    };

    return NoticeModel.createNoticeInfos(appkey, [notice]);
  }

  /**
   * 创建申请加入群的通知
   * @param {String} appkey 
   * @param {Object} noticeInfo 
   */
  async createAddGroupNotice(appkey, noticeInfo, creatorId) {
    const notice = {
      notice_type: 2,
      source_contact_id: noticeInfo.source_contact_id,
      target_contact_id: creatorId,
      target_group_id: noticeInfo.target_group_id,
      notice_text: `${noticeInfo.source_contact_nickname}请求加入${noticeInfo.target_group_name}`
    };

    return NoticeModel.createNoticeInfos(appkey, [notice]);
  }
}

module.exports = {
  NoticesService: new NoticesService(),
}
