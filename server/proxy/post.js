const url = require('url');
const moment = require('moment');
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
    if (params.keyword) {
        switch (params.filterType) {
            case '1':
                query.title = { $regex: params.keyword, $options: 'gi' };
                break;
            case '2':
                query.labels = { $regex: params.keyword, $options: 'gi' };
                break;
            case '3':
                query.createTime = { $regex: params.keyword, $options: 'gi' };
                break;
            default:
                query.$or = [{
                    title: {
                        $regex: params.keyword,
                        $options: 'gi'
                    }
                }, {
                    labels: {
                        $regex: params.keyword,
                        $options: 'gi'
                    }
                }, {
                    summary: {
                        $regex: params.keyword,
                        $options: 'gi'
                    }
                }, {
                    content: {
                        $regex: params.keyword,
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
            PostModel.estimatedDocumentCount(query).exec()
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