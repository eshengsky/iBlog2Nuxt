const url = require('url');
const moment = require('moment');
const base = require('./base');
const mongoose = require('mongoose');
const BaseSchema = base.BaseSchema;

const PostSchema = new mongoose.Schema(Object.assign({}, BaseSchema.obj, {
    // 标题
    title: { type: String },

    // 文章别名
    alias: { type: String },

    // 摘要
    summary: { type: String },

    // 内容
    content: { type: String },

    // 分类
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },

    // 标签
    labels: { type: Array },

    // 外链Url
    url: { type: String },

    // 浏览次数
    viewCount: { type: Number, default: 0 },

    // 是否本地文档，否则是外链
    isLocal: { type: Boolean, default: true },

    // 是否草稿
    isDraft: { type: Boolean, default: false },

    // 是否有效
    isActive: { type: Boolean, default: true }
}));

// 虚拟字段：发布日期
PostSchema.virtual('publishDate').get(function () {
    return moment(this.createTime).format('YYYY-MM-DD');
});

// 虚拟字段：外链主机名
PostSchema.virtual('host').get(function () {
    return this.url ? url.parse(this.url).host : '';
});
module.exports = mongoose.model('post', PostSchema, 'post');