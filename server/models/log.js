const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    // 唯一键
    _id: { type: String, unique: true },

    // 异常信息
    message: { type: String },

    // 记录时间
    timestamp: { type: Date },

    // 级别
    level: { type: String },

    // 详细信息
    meta: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model('log', logSchema, 'log');