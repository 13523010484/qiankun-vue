const mongoose = require('mongoose');
const { Schema } = mongoose;

// 用户岗位关联表 Schema 定义
const UserPostSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});

// 使用 Schema 创建模型，注意模型名称首字母大写，Mongoose 会自动处理复数形式
const UserPost = mongoose.model('UserPost', UserPostSchema, 'userPosts');

module.exports = {
  UserPost,
};
