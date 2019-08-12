const mongoose = require('mongoose');
const moment = require('moment');

const CommentSchema = new mongoose.Schema({
    // 评论者用户名
    username: { type: String },

    // 评论者显示名
    displayName: { type: String },

    // 评论者头像地址
    avatar: { type: String },

    // 评论内容
    content: { type: String },

    // 创建时间
    createTime: { type: Date, default: new Date() },

    // 修改时间
    modifyTime: { type: Date, default: new Date() }
}, {
        // 设置查询时默认返回虚拟字段
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

CommentSchema.add({
    // 回复列表
    comments: [CommentSchema]
});

// 虚拟字段：评论时间字符串
CommentSchema.virtual('commentTimeStr').get(function () {
    return moment(this.createTime).format('YYYY年MM月DD日 hh:mm:ss');
});
module.exports = CommentSchema;
