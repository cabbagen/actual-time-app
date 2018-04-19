const mongoose = require('mongoose');
const { modelLogger, databaseError, paramsError } = require('./common.js');

const Schema = mongoose.Schema;

const groupsSchema = new Schema({
  _id: Schema.Types.ObjectId,
  groupName: { type: String, queue: true },
  creator: Schema.Types.ObjectId,
  members: [{ type: Schema.Types.ObjectId }],
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  appKey: String,
});

groupsSchema.statics.isGroupOwner = function() {

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
 */
groupsSchema.statics.deleteGroups = function(params, callback) {
  if (!params.appKey || !params._id) {
    callback(paramsError, null);
    return;
  }

  const { appKey, _id } = params;
  return this.deleteOne({ appKey, _id }).exex()
    .then((data) => {
      callback(null, data);
    }, (error) => {
      modelLogger.error(error.message);
      callback(databaseError, null);
    });
}

/**
 * 获取群组信息
 */
groupsSchema.statics.getGroupInfos = function(params, callback) {

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

}

/**
 * 添加 IM 用户
 */
groupsSchema.statics.addRoomerToGroup = function(params, callback) {

}

/**
 * 清除 IM 用户
 */
groupsSchema.statics.removeRoomerToGroup = function(params, callback) {

}


module.exports = groupsSchema;
