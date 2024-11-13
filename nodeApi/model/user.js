const mongoose = require('mongoose');

// 用户表 Schema 定义
const UserSchema = new mongoose.Schema({
  // 用户编号
  operId: {
    type: String,
    default: '',
  },
  // 用户名
  operCode: {
    type: String,
    default: '',
  },
  // 用户姓名
  operName: {
    type: String,
    default: '',
  },
  // 所属机构
  memCode: {
    type: String,
    default: '',
  },
  // 所属部门
  deptId: {
    type: String,
    default: '',
  },
  // 办公电话
  officeTel: {
    type: String,
    default: '',
  },
  // 手机
  mobile: {
    type: String,
    default: '',
  },
  // 更新人
  updateOperName: {
    type: String,
    default: '',
  },
  // 职务类别
  posiType: {
    type: String,
    default: '',
  },
  // 备注
  remark: {
    type: String,
    default: '',
  },
  // 用户状态
  operStatus: {
    type: String,
    default: '',
  },
  // 用户类型
  operType: {
    type: String,
    default: '',
  },
  // 录入人
  inputOperId: {
    type: String,
    default: '',
  },
  // 录入时间
  inputTm: {
    type: String,
    default: '',
  },
  // 更新人
  updateOperId: {
    type: String,
    default: '',
  },
  // 更新时间
  updateTm: {
    type: String,
    default: '',
  },
  // 复核人
  reviewOperId: {
    type: String,
    default: '',
  },
  // 复核时间
  reviewTm: {
    type: String,
    default: '',
  },
  // 密码
  password: {
    type: String,
    default: '',
  },
});

// 使用 Schema 创建模型，注意模型名称首字母大写，Mongoose 会自动处理复数形式
const User = mongoose.model('User', UserSchema, 'users');

module.exports = {
  User,
};
