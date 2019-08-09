const base = require('./base');
const mongoose = require('mongoose');
const moment = require('moment');
const BaseSchema = base.BaseSchema;

const CommentSchema = new mongoose.Schema(Object.assign({}, BaseSchema.obj, {
    // 评论对应的文章ID
    articleId: { type: mongoose.Schema.Types.ObjectId },

    // 评论者用户名
    username: { type: String },

    // 评论者显示名
    displayName: { type: String },

    // 评论者头像地址
    avatar: { type: String },

    // 评论内容
    content: { type: String }
}), {
        // 设置查询时默认返回虚拟字段
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

// 虚拟字段：评论时间字符串
CommentSchema.virtual('commentTimeStr').get(function () {
    return moment(this.createTime).format('YYYY-MM-DD hh:mm:ss');
});
module.exports = mongoose.model('comment', CommentSchema, 'comment');
