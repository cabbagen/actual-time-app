// const GroupModel = require('../../../model/notices.model').init();
const GroupModel = require('../../../model/groups.model').init();

class GroupService {
  
  async getGroupCreatorInfo(appkey, groupId) {
    return GroupModel.getGroupCreatorInfo(appkey, groupId);
  }

}

module.exports = {
  GroupService: new GroupService(),
};
