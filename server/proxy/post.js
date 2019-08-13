const PostModel = require('../models/post');
const pageSize = 3;

/**
 * 为首页数据查询构建条件对象
 * @param params 查询参数对象
 */
function getPostsQuery(params) {
    const query = {};
    query.isActive = true;
    query.isDraft = false;
    if (params.cateId) {
        query.category = params.cateId;
    }
    const keyword = params.keyword;
    if (keyword) {
        switch (params.filterType) {
            case 'title':
                query.title = { $regex: keyword, $options: 'gi' };
                break;
            case 'tag':
                query.labels = { $regex: keyword, $options: 'gi' };
                break;
            case 'date':
                if (Array.isArray(keyword) && keyword.length === 2 && keyword[0] && keyword[1]) {
                    const start = new Date(keyword[0]);
                    const end = new Date(keyword[1]);
                    query.createTime = { $gt: start, $lt: end };
                }
                break;
            default:
                query.$or = [{
                    title: {
                        $regex: keyword,
                        $options: 'gi'
                    }
                }, {
                    labels: {
                        $regex: keyword,
                        $options: 'gi'
                    }
                }, {
                    summary: {
                        $regex: keyword,
                        $options: 'gi'
                    }
                }, {
                    content: {
                        $regex: keyword,
                        $options: 'gi'
                    }
                }];
        }
    }
    return query;
}

exports.getPosts = async (params) => {
    let page = 1;
    let postList = [];
    let pageCount = 0;
    try {
        page = parseInt(params.pageIndex) || 1;
        page = page > 0 ? page : 1;
        const options = {};
        options.skip = (page - 1) * pageSize;
        options.limit = pageSize;
        options.sort = params.sortBy === 'title' ? 'title -createTime' : '-createTime';
        const query = getPostsQuery(params);
        const data = await Promise.all([
            PostModel.find(query, {}, options).populate('category').exec(),
            PostModel.countDocuments(query).exec()
        ]);
        postList = data[0];
        const count = data[1];
        pageCount = count % pageSize === 0 ? parseInt(count / pageSize) : parseInt(count / pageSize) + 1;
    } catch (err) {
        console.error(err);
    }
    return {
        postList,
        hasNext: pageCount > page
    };
}

exports.getArticle = async (params) => {
    let article;
    try {
        const alias = params.alias;
        article = await PostModel.findOne({ alias }).exec();
    } catch (err) {
        console.error(err);
    }
    return {
        article
    };
}

exports.saveComment = async (params) => {
    try {
        const articleId = params.articleId;
        const postEntry = await PostModel.findById(articleId).exec();
        const username = params.username;
        const displayName = params.displayName;
        const avatar = params.avatar;
        const content = params.content;
        const pathId = params.pathId;
        let parentComments = postEntry.comments;
        if (pathId) {
            const commentIdArr = pathId.split('>');
            commentIdArr.forEach(commentId => {
                parentComments = parentComments.id(commentId).comments;
            });
        }
        const now = new Date();
        parentComments.unshift({
            username,
            displayName,
            avatar,
            content,
            createTime: now,
            modifyTime: now
        });
        postEntry.save();
    } catch (err) {
        console.error(err);
    }
}
