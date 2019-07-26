const base = require('./base');
const mongoose = require('mongoose');
const BaseSchema = base.BaseSchema;

const CategorySchema = new mongoose.Schema(Object.assign({}, BaseSchema.obj, {
    // 分类名称
    cateName: { type: String },

    // 分类别名
    alias: { type: String },

    // 图标地址
    img: { type: String },

    // 链接地址
    link: { type: String }
}));
module.exports = mongoose.model('category', CategorySchema, 'category');
