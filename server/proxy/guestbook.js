const GuestbookModel = require('../models/guestbook');
exports.getGuestbook = async () => {
    let guestbook;
    try {
        guestbook = await GuestbookModel.find().exec();
    } catch (err) {
        console.error(err);
    }
    return {
        guestbook
    };
}

exports.saveGuestbook = async (params) => {
    try {
        const username = params.username;
        const displayName = params.displayName;
        const avatar = params.avatar;
        const content = params.content;
        const pathId = params.pathId;
        const now = new Date();
        const item = {
            username,
            displayName,
            avatar,
            content,
            createTime: now,
            modifyTime: now
        };
        if (pathId) {
            const commentIdArr = pathId.split('>');
            const rootComment = await GuestbookModel.findById(commentIdArr[0]).exec();
            let parentComments = rootComment.comments;
            commentIdArr.forEach((commentId, index) => {
                if (index > 0) {
                    parentComments = parentComments.id(commentId).comments;
                }
            });
            parentComments.unshift(item);
            rootComment.save();
        } else {
            const newItem = new GuestbookModel(item)
            newItem.save();
        }
    } catch (err) {
        console.error(err);
    }
}
