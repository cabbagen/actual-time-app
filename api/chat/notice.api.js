const BaseApiController = require('../base.api');
const NoticeModel = require('../../model/notice.model').init();
const utils = require('../../providers/utils.provider');

class NoticeApiController extends BaseApiController {

  static init() {
    return new NoticeApiController();
  }

  // 创建通知信息
  async addNoticeInfos(request, response) {

  }

  // 查询通知信息详情
  async getNoticeInfo(request, response) {
    
  }

  // 删除通知信息
  async removeNoticeInfos(request, response) {

  }

  // 更新通知信息
  async updateNoticeInfo(request, response) {

  }
}

module.exports = NoticeApiController;
