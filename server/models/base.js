const mongoose = require('mongoose');

// 基础Schema
const BaseSchema = new mongoose.Schema({
    // 主键
    _id: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() },
    
    // 创建时间
    createTime: { type: Date },

    // 修改时间
    modifyTime: { type: Date }
});
exports.BaseSchema = BaseSchema;
