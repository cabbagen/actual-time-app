
/**
 * groups service
 * 提供 im groups 的相关操作
 */

const GroupModel = require('../../../model/groups.model').init();

class GroupsService {

  /**
   * 获取群主的相关信息
   * @param {String} appkey 
   * @param {String} groupId 
   */
  async getGroupCreatorInfo(appkey, groupId) {

    return GroupModel.getGroupCreatorInfo(appkey, groupId);
  }
}

module.exports = {
  GroupsService: new GroupsService(),
}
