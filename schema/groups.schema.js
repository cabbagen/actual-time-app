const mongoose = require('mongoose');
const { modelLogger, databaseError, paramsError } = require('./common.js');

const Schema = mongoose.Schema;

const groupsSchema = new Schema({
  group_name: { type: String, queue: true },
  group_introduce: { type: String, default: '暂无群介绍' },
  group_avator: String,
  creator: { type: Schema.Types.ObjectId, ref: 'contacts' },
  members: [{ type: Schema.Types.ObjectId, ref: 'contacts' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  app_key: String,
});

/**
 * 判断是否为群主
 * @params 查询参数 { username: [String], appKey: [String] }
 * @return Promise or null
 */
groupsSchema.statics.isGroupOwner = function(params) {
  const { usernmae, appKey } = params;
  if (typeof username === 'undefined' || typeof appKey === 'undefined') {
    return null;
  }
  return this.findOne({ username, appKey }).exec();
}

/**
 * 创建一个 IM 小组
 */
groupsSchema.statics.createGroups = function(params, callback) {
  return this.create(params).then((data) => {
    callback(null, data);
  }, (error) => {
    modelLogger.error(error.message);
    callback(databaseError, null);
  });
}

/**
 * 删除一个小组
 * @params { appKey: [String], _id: [String] }
 */
groupsSchema.statics.deleteGroups = function(params, callback) {
  if (!params.appKey || !params._id) {
    callback(paramsError, null);
    return;
  }

  return this.deleteOne({ appKey: params.appKey, _id: params._id }).exex()
    .then((data) => {
      callback(null, data);
    }, (error) => {
      modelLogger.error(error.message);
      callback(databaseError, null);
    });
}

/**
 * 获取群组信息
 * @params { appKey: [String], _id: [String] }
 */
groupsSchema.statics.getGroupInfos = function(params, callback) {
  if (!params.appKey || !params._id) {
    callback(paramsError, null);
    return;
  }
  return this.findOne({ appKey: params.appKey, _id: params._id }).exex()
    .then((data) => {
      callback(null, data);
    }, (error) => {
      modelLogger.error(error.message);
      callback(databaseError, null);
    });
}

/**
 * 退群组
 */
groupsSchema.statics.leaveGroups = function(params, callback) {

}

/**
 * 修改群组名称
 */
groupsSchema.statics.modifyGroupsName = function(params, callback) {
  const { appKey, groupName, _id } = params;
  if (typeof appKey === 'undefined' || typeof _id === 'undefined' || typeof groupName === 'undefined') {
    callback(paramsError, null);
    return;
  }
  return this.updateOne({ appKey, _id }, { groupName }).exec()
    .then((data) => {
      callback(null, data);
    }, (error) => {
      modelLogger.error(error.message);
      callback(databaseError, null);
    });
}

/**
 * 添加 IM 用户
 */
groupsSchema.statics.addRoomerToGroup = function(params, callback) {

}

/**
 * 清除 IM 用户
 */
groupsSchema.statics.removeRoomerFromGroup = function(params, callback) {

}


module.exports = groupsSchema;
