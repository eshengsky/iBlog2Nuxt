const mongoose = require('mongoose');

// 基础Schema
const BaseSchema = new mongoose.Schema({    
    // 创建时间
    createTime: { type: Date, default: new Date() },

    // 修改时间
    modifyTime: { type: Date, default: new Date() }
});
exports.BaseSchema = BaseSchema;
