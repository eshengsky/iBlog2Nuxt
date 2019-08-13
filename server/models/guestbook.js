const mongoose = require('mongoose');
const CommentSchema = require('./comment');
module.exports = mongoose.model('guestbook', CommentSchema, 'guestbook');
