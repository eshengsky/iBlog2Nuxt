const CommentModel = require('../models/comment');
exports.getComments = async (params) => {
    let commentList = [];
    let commentCount = 0;
    try {
        const query = {
            articleId: params.articleId
        };
        const data = await Promise.all([
            CommentModel.find(query, {}, {
                sort: '-createTime'
            }).exec(),
            CommentModel.countDocuments(query).exec()
        ]);
        commentList = data[0];
        commentCount = data[1];
    } catch (err) {
        console.error(err);
    }
    return {
        commentList,
        commentCount
    };
}

exports.saveComment = async (params) => {
    try {
        const articleId = params.articleId;
        const username = params.username;
        const displayName = params.displayName;
        const avatar = params.avatar;
        const content = params.content;
        const commentEntry = new CommentModel({
            articleId,
            username,
            displayName,
            avatar,
            content
        });
        await commentEntry.save();
    } catch (err) {
        console.error(err);
    }
}
