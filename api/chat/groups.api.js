const BaseApiController = require('../base.api');
const GroupsModel = require('../../model/groups.model').init();
const MessageModel = require('../../model/messages.model').init();
const utils = require('../../providers/utils.provider');

class GroupsApiController extends BaseApiController {

  static init() {
    return new GroupsApiController();
  }

  // 创建群组
  async createGroupInfos(request, response) {
    const { appkey, groupInfos } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(groupInfos) !== 'Array') {
      return response.json(this.exceptions['1002']);
    }

    const result = await GroupsModel.createGroupInfos(appkey, groupInfos);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(this.exceptions['1000']);
  }

  // 删除群组
  async removeGroupInfos(request, response) {
    const { appkey, groupIds } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(groupIds) !== 'Array') {
      return response.json(this.exceptions['1002']);
    }

    const result = await GroupsModel.removeGroupInfos(appkey, groupIds);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(this.exceptions['1000']);
  }

  // 获取群组信息
  async getGroupInfo(request, response) {
    const { appkey, groupId } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(groupId) !== 'String') {
      return response.json(this.exceptions['1002']);
    }

    const result = await GroupsModel.getGroupInfo(appkey, groupId);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(Object.assign({}, this.exceptions['1000'], { data: result.result }));
  }

  // 查询群组列表
  async getGroupInfos(request, response) {
    const { appkey, keyword = '', pageSize = 10, pageIndex = 0, type = 1 } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }
    
    const conditionMap = {
      1: { group_name: { $regex: keyword } },
    };

    const result = await GroupsModel.getGroupInfos(appkey, conditionMap[type], pageIndex, pageSize);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(Object.assign({}, this.exceptions['1000'], { data: result.result }));
  }

  // 更新群组信息
  async updateGroupInfo(request, response) {
    const { appkey, groupId, groupInfo } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(groupId) !== 'String' || utils.checkType(groupInfo) !== 'Object') {
      return response.json(this.exceptions['1002']);
    }

    const result = await GroupsModel.updateGroupInfo(appkey, groupId, groupInfo);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(this.exceptions['1000']);
  }

  // 查询群组成员
  async getGroupMembers(request, response) {
    const { appkey, groupId } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(groupId) !== 'String') {
      return response.json(this.exceptions['1002']);
    }

    const result = await GroupsModel.getGroupMembers(appkey, groupId);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(Object.assign({}, this.exceptions['1000'], { data: result.result }));
  }

  // 查询群组聊天记录
  async getGroupMessages(request, response) {
    const { appkey, groupId } = request.body;
    const { startTime = null, endTime = null, pageIndex = 0, pageSize = 10 } = request.body;

    if (utils.checkType(appkey) !== 'String') {
      return response.json(this.exceptions['1001']);
    }

    if (utils.checkType(groupId) !== 'String') {
      return request.json(this.exceptions['1002']);
    }

    const condition = { startTime, endTime, pageIndex, pageSize };
    const result = await MessageModel.getGroupMessages(appkey, groupId, condition);

    if (result.error !== null) {
      return response.json(Object.assign({}, this.exceptions['1003'], { error: result.error }));
    }

    return response.json(Object.assign({}, this.exceptions['1000'], { data: result.result }));
  }
}

module.exports = GroupsApiController;
