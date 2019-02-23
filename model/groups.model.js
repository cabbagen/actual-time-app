const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const utils = require('../providers/utils.provider');
const groupsSchema = require('../schema/groups.schema');
const contactsSchema = require('../schema/contacts.schema');

class GroupsModel extends BaseModel {

  static init() {
    return new GroupsModel();
  }

  constructor(props) {
    super(props);
    this.groupsModel = mongoose.model('groups', groupsSchema);
    this.contactsModel = mongoose.model('contacts', contactsSchema);
  }

  /**
   * 创建IM群组
   * @param {String} appkey 
   * @param {Object[]} groupInfos - 字段 与 schema 相同
   */
  async createGroupInfos(appkey, groupInfos) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(groupInfos) !== 'Array') {
      return { result: null, error: this.paramsError };
    }

    const realGroupInfos = groupInfos.map((groupInfo) => {
      return { ...groupInfo, appkey };
    });

    return this.groupsModel.create(realGroupInfos).then(this.resolve).catch(this.reject);
  }

  /**
   * 删除群组
   * @param {String} appkey 
   * @param {String[]} groupIds - 要删除的群组 id
   */
  async removeGroupInfos(appkey, groupIds) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(groupIds) !== 'Array') {
      return { result: null, error: this.paramsError };
    }

    const realGroupIds = groupIds.map(groupId => mongoose.Types.ObjectId(groupId));
    const condition = { _id: { $in: realGroupIds }, appkey };

    return this.groupsModel.deleteMany(condition).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 获取群组详情
   * @param {String} appkey 
   * @param {String} groupId 
   */
  async getGroupInfo(appkey, groupId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(groupId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const condition = { appkey, _id: mongoose.Types.ObjectId(groupId) };

    return this.groupsModel.findOne(condition).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 获取群组列表
   * @param {String} appkey 
   * @param {Object} condition - 查询条件
   * @param {Number} pageIndex 
   * @param {Number} pageSize 
   */
  async getGroupInfos(appkey, condition, pageIndex = 0, pageSize = 10 ) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(condition) !== 'Object' || utils.checkType(pageIndex) !== 'Number' || utils.checkType(pageSize) !== 'Number') {
      return { result: null, error: this.paramsError };
    }

    const realCondition = Object.assign({}, condition, { appkey });

    const groupsResult = await this.groupsModel.find(realCondition).skip(pageIndex * pageSize).limit(pageSize).exec().then(this.resolve).catch(this.reject);
    const totalResult = await this.groupsModel.find(realCondition).count().exec().then(this.resolve).catch(this.reject);

    if (groupsResult.error !== null || totalResult.error !== null) {
      return groupsResult.error ? groupsResult : totalResult;
    }

    const successResult = {
      error: null,
      result : { total: totalResult.result, groupInfos: groupsResult.result },
    };

    return new Promise((resolve) => {
      return resolve(successResult);
    });
  }

  /**
   * 更新群组信息
   * @param {String} appkey 
   * @param {String} groupId 
   * @param {Object} groupInfo - 字段 与 schema 相同
   */
  async updateGroupInfo(appkey, groupId, groupInfo) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(groupId) !== 'String' || utils.checkType(groupInfo) !== 'Object') {
      return { result: null, error: this.paramsError };
    }

    return this.groupsModel.update({ _id: mongoose.Types.ObjectId(groupId) }, groupInfo).exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 获取组内成员
   * @param {String} appkey 
   * @param {String} groupId 
   */
  async getGroupMembers(appkey, groupId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(groupId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    return this.groupsModel.findOne({ _id: mongoose.Types.ObjectId(groupId), appkey }, { members: 1 }).populate('members').exec().then(this.resolve).catch(this.reject);
  }

  /**
   * 添加小组成员
   * @param {String} appkey 
   * @param {String} groupId 
   * @param {String} memberId 
   */
  async createGroupMember(appkey, groupId, memberId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(groupId) !== 'String' || utils.checkType(memberId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const groupsResult = await this.groupsModel
      .update({ appkey, _id: mongoose.Types.ObjectId(groupId) }, { $push: { members: mongoose.Types.ObjectId(memberId) } })
      .exec().then(this.resolve).catch(this.reject);

    if (groupsResult.error) {
      return groupsResult;
    }

    const contactsResult = await this.contactsModel
      .update({ appkey, _id: mongoose.Types.ObjectId(memberId) }, { $push: { groups: mongoose.Types.ObjectId(groupId) } })
      .exec().then(this.resolve).catch(this.reject);

    if (contactsResult.error) {
      // 回退群组信息
      if (!groupsResult.error) {
        await this.groupsModel
          .update({ appkey, _id: mongoose.Types.ObjectId(memberId) }, { $pop: { groups: 1 } })
          .exec().then(this.resolve).catch(this.reject);
      }

      return contactsResult;
    }

    return { result: 'ok', error: null };
  }

  /**
   * 删除小组成员
   * @param {String} appkey 
   * @param {String} groupId 
   * @param {String} memberId 
   */
  async removeGroupMember(appkey, groupId, memberId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(groupId) !== 'String' || utils.checkType(memberId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const groupsResult = await this.groupsModel
      .update({ appkey, _id: mongoose.Types.ObjectId(groupId) }, { $pull: { members: mongoose.Types.ObjectId(memberId) } })
      .exec().then(this.resolve).catch(this.reject);

    if (groupsResult.error) {
      return groupsResult;
    }

    const contactsResult = await this.contactsModel
      .update({ appkey, _id: mongoose.Types.ObjectId(memberId) }, { $pull: { groups: mongoose.Types.ObjectId(groupId) } })
      .exec().then(this.resolve).catch(this.reject);

    if (contactsResult.error) {
      // 回退群组信息
      if (!groupsResult.error) {
        await this.groupsModel
          .update({ appkey, _id: mongoose.Types.ObjectId(memberId) }, { $push: { members: mongoose.Types.ObjectId(memberId) }})
          .exec().then(this.resolve).catch(this.reject);
      }

      return contactsResult;
    }

    return { result: 'ok', error: null };
  }

  /**
   * 解散群组
   * @param {String} appkey 
   * @param {String} groupId 
   * @param {String} creatorId 
   */
  async disbandGroup(appkey, groupId, creatorId) {
    const isGroupCreator = await this.isGroupCreator(appkey, groupId, creatorId);

    if (utils.checkType(isGroupCreator) !== 'Boolean' || !isGroupCreator) {
      return { result: null, error: '您不是群主，没有权限操作' };
    }

    return this.removeGroupInfos(appkey, [groupId]);
  }

  /**
   * 是否为群主
   * @param {String} appkey 
   * @param {String} groupId 
   * @param {String} creatorId 
   */
  async isGroupCreator(appkey, groupId, creatorId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(groupId) !== 'String' || utils.checkType(creatorId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const groupInfoResult = await this.getGroupInfo(appkey, groupId);

    if (groupInfoResult.error) {
      return groupInfoResult;
    }

    return groupInfoResult.result.creator = creatorId;
  }

  /**
   * 获取群组群主信息
   * @param {String} appkey 
   * @param {String} groupId 
   */
  async getGroupCreatorInfo(appkey, groupId) {
    if (utils.checkType(appkey) !== 'String' || utils.checkType(groupId) !== 'String') {
      return { result: null, error: this.paramsError };
    }

    const groupInfoResult = await this.getGroupInfo(appkey, groupId);

    if (groupInfoResult.error) {
      return groupInfoResult;
    }

    const creator = groupInfoResult.result.creator;

    return this.contactsModel.findOne({ appkey, _id: mongoose.Types.ObjectId(creator) }).exec().then(this.resolve).catch(this.reject);
  }
}

module.exports = GroupsModel;
