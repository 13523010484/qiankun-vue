const mongoose = require('mongoose');

// 岗位表 Schema 定义
const PostSchema = new mongoose.Schema({
  // 岗位 id
  postId: {
    type: String,
    default: '',
  },
  // 岗位名称
  postName: {
    type: String,
    default: '',
  },
  // 参与者账号
  memId: {
    type: String,
    default: '',
  },
  // 参与者编号
  memCode: {
    type: String,
    default: '',
  },
  // 参与者简称
  memSname: {
    type: String,
    default: '',
  },
  // 所属部门
  deptId: {
    type: String,
    default: '',
  },
  // 岗位类别
  postType: {
    type: String,
    default: '',
  },
  // 岗位状态
  postStatus: {
    type: String,
    default: '',
  },
  // 备注
  remark: {
    type: String,
    default: '',
  },
  // 岗位描述
  desc: {
    type: String,
    default: '',
  },
  // 授权岗位 id
  authorizePostId: {
    type: String,
    default: '',
  },
  // 权限范围
  sysRight: {
    type: String,
    default: '',
  },
  // 录入操作员编号
  inputOperId: {
    type: String,
    default: '',
  },
  // 录入操作员姓名
  inputOperName: {
    type: String,
    default: '',
  },
  // 录入时间
  operTm: {
    type: String,
    default: '',
  },
  // 复核操作员编码
  reviewOperId: {
    type: String,
    default: '',
  },
  // 复核操作员姓名
  reviewOperName: {
    type: String,
    default: '',
  },
  // 复核时间
  reviewTm: {
    type: String,
    default: '',
  },
  // 更新操作员编号
  updateOperTm: {
    type: String,
    default: '',
  },
  // 更新操作员姓名
  updateOperName: {
    type: String,
    default: '',
  },
  // 更新时间
  updateTm: {
    type: String,
    default: '',
  },
  // 录入操作员用户名
  inputOperCode: {
    type: String,
    default: '',
  },
  // 复核操作员用户名
  reviewOperCode: {
    type: String,
    default: '',
  },
  // 更新操作员用户名
  updateOperCode: {
    type: String,
    default: '',
  },
});

// 使用 Schema 创建模型，注意模型名称首字母大写，Mongoose 会自动处理复数形式
const Post = mongoose.model('Post', PostSchema, 'posts');

module.exports = {
  Post,
};
