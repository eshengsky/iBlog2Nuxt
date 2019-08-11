const url = require('url');
const moment = require('moment');
const base = require('./base');
const mongoose = require('mongoose');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const BaseSchema = base.BaseSchema;
const CommentSchema = require('./comment');

const PostSchema = new mongoose.Schema(Object.assign({}, BaseSchema.obj, {
    // 标题
    title: { type: String },

    // 文章别名
    alias: { type: String, unique: true },

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
    isActive: { type: Boolean, default: true },

    // 评论列表
    comments: [CommentSchema]
}), {
        // 设置查询时默认返回虚拟字段
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

// 虚拟字段：发布日期
PostSchema.virtual('publishDate').get(function () {
    return moment(this.createTime).format('YYYY-MM-DD');
});

// 虚拟字段：创建时间字符串
PostSchema.virtual('createTimeStr').get(function () {
    return moment(this.createTime).format('YYYY-MM-DD hh:mm');
});

// 虚拟字段：外链主机名
PostSchema.virtual('host').get(function () {
    return this.url ? url.parse(this.url).host : '';
});

// 虚拟字段：html
PostSchema.virtual('html').get(function () {
    if (this.content) {
        const md = new MarkdownIt({
            highlight: function (str, lang) {
                let showLang = '';
                let code = '';
                if (lang) {
                    showLang = lang.toUpperCase();
                    try {
                        code = hljs.highlight(lang, str, true).value;
                    } catch (err) {}
                }
                if (!code) {
                    code = md.utils.escapeHtml(str);
                }
                return '<pre class="hljs"><div class="pre-header"><div class="pre-header-left"><div></div><div></div><div></div></div><div class="pre-header-right">'
                + showLang
                + '</div></div><code>'
                + code
                + '</code></pre>';
            }
        });
        return md.render(this.content);
    }
    return '';
});

module.exports = mongoose.model('post', PostSchema, 'post');
