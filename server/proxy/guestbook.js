const GuestbookModel = require('../models/guestbook');
const pageSize = 3;

exports.getGuestbook = async (params) => {
    let page = 1;
    let guestbook = [];
    let pageCount = 0;
    let total = 0;
    try {
        page = parseInt(params.pageIndex) || 1;
        page = page > 0 ? page : 1;
        const options = {};
        options.skip = (page - 1) * pageSize;
        options.limit = pageSize;
        options.sort = '-createTime';
        const data = await Promise.all([
            GuestbookModel.find({}, {}, options).exec(),
            GuestbookModel.countDocuments().exec(),
            GuestbookModel.find().exec(),
        ]);
        guestbook = data[0];
        const count = data[1];
        const allData = data[2];
        const getCount = comments => {
            total += comments.length;
            comments.forEach(item => {
                getCount(item.comments);
            });
        }
        allData.forEach(data => {
            total += 1;
            getCount(data.comments);
        });
        pageCount = count % pageSize === 0 ? parseInt(count / pageSize) : parseInt(count / pageSize) + 1;
    } catch (err) {
        console.error(err);
    }
    return {
        guestbook,
        total,
        hasNext: pageCount > page
    };
}

exports.saveGuestbook = async (params, user) => {
    try {
        const username = user.username;
        const displayName = user.displayName;
        const avatar = user._json.avatar_url;
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
            await rootComment.save();
        } else {
            const newItem = new GuestbookModel(item)
            newItem.save();
        }
    } catch (err) {
        console.error(err);
    }
}
