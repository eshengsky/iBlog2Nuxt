import DB from '../db';
import BadWords from '../bad_words/index';
const { Post, Cache, Category, Comment, Guestbook, Setting } = DB.Models;
const badWords = BadWords.instance;

async function getCategories () {
    const categories = await Category.find(
        {},
        {},
        { sort: 'sequence cateName' }
    ).exec();
    return categories;
}

async function getPosts (params) {
    let page = 1;
    let postList: any[] = [];
    let pageCount = 0;
    let count = 0;
    const pageSize = parseInt(params.pageSize);
    try {
        page = parseInt(params.pageIndex) || 1;
        page = page > 0 ? page : 1;
        const conditions: any = {
            isDraft: false,
            isActive: true
        };
        if (params.category) {
            conditions.category = params.category;
        }
        const keyword = params.keyword;
        if (keyword) {
            switch (params.filterType) {
                case 'title':
                    conditions.title = { $regex: keyword, $options: 'gi' };
                    break;
                case 'tag':
                    conditions.labels = { $regex: keyword, $options: 'gi' };
                    break;
                case 'date':
                    if (
                        Array.isArray(keyword) &&
            keyword.length === 2 &&
            keyword[0] &&
            keyword[1]
                    ) {
                        const start = new Date(keyword[0]);
                        const end = new Date(keyword[1]);
                        conditions.createTime = { $gte: start, $lt: end };
                    }
                    break;
                default:
                    conditions.$or = [
                        {
                            title: {
                                $regex: keyword,
                                $options: 'gi'
                            }
                        },
                        {
                            labels: {
                                $regex: keyword,
                                $options: 'gi'
                            }
                        },
                        {
                            content: {
                                $regex: keyword,
                                $options: 'gi'
                            }
                        }
                    ];
            }
        }
        const data = await Promise.all([
            Post.find(
                conditions,
                {},
                {
                    skip: (page - 1) * pageSize,
                    limit: pageSize,
                    sort: '-createTime'
                }
            )
                .populate('category', '-img')
                .populate('comments', '_id')
                .exec(),
            Post.countDocuments(conditions).exec()
        ]);
        postList = data[0];
        count = data[1];
        pageCount = Math.ceil(count / pageSize);
    } catch (err) {
        console.error(err);
    }
    return {
        postList,
        count,
        hasNext: pageCount > page
    };
}

async function getPopArticles () {
    const articles = await Post.find({}, '-content', {
        sort: '-viewCount',
        limit: 7
    })
        .populate('category')
        .exec();
    return {
        articles
    };
}

async function getPopLabels () {
    const labels = await Post.aggregate([
        {
            $unwind: '$labels'
        },
        {
            $group: {
                _id: '$labels',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1, _id: 1 }
        },
        {
            $limit: 10
        }
    ]).exec();
    return {
        labels
    };
}

async function getArticle (params) {
    let article;
    try {
        const alias = params.alias;
        article = await Post.findOne({ alias })
            .populate('category')
            .exec();
    } catch (err) {
        console.error(err);
    }
    return article;
}

async function getPostsCountByCate (category) {
    let count = 0;
    try {
        count = await Post.countDocuments({ category }).exec();
    } catch (err) {
        console.error(err);
    }
    return count;
}

async function increaseViews ({ postID, clientIP }) {
    // 判断该IP用户是否已看过该文章
    const exists = await Cache.exists({
        clientIP,
        ext1: postID
    });

    // 如果没看过
    if (!exists) {
    // 文章浏览数+1
        Post.findByIdAndUpdate(postID, {
            $inc: { viewCount: 1 }
        }).exec();

        // 同时，将用户IP和文章ID存入缓存
        Cache.create({
            clientIP,
            ext1: postID
        });
    }
}

async function getComments (params) {
    let page = 1;
    let comments: any[] = [];
    let pageCount = 0;
    let count = 0;
    const pageSize = parseInt(params.pageSize);
    try {
        page = parseInt(params.pageIndex) || 1;
        page = page > 0 ? page : 1;
        const options: any = {};
        options.skip = (page - 1) * pageSize;
        options.limit = pageSize;
        options.sort = '-createTime';
        const query = {
            post: params.articleId
        };
        const data = await Promise.all([
            Comment.find(query, {}, options).exec(),
            Comment.countDocuments(query).exec()
        ]);
        comments = data[0];
        count = data[1];
        pageCount = Math.ceil(count / pageSize);
    } catch (err) {
        console.error(err);
    }
    return {
        comments,
        count,
        hasNext: pageCount > page
    };
}

async function saveComment (params) {
    const entity = new Comment({
        post: params.articleId,
        username: badWords.filter(params.username),
        website: params.website,
        content: badWords.filter(params.content),
        createTime: new Date()
    });
    const comment = await entity.save();
    return {
        comment
    };
}

async function getGuestbook (params) {
    let page = 1;
    let comments: any[] = [];
    let pageCount = 0;
    let count = 0;
    const pageSize = parseInt(params.pageSize);
    try {
        page = parseInt(params.pageIndex) || 1;
        page = page > 0 ? page : 1;
        const options: any = {};
        options.skip = (page - 1) * pageSize;
        options.limit = pageSize;
        options.sort = '-createTime';
        const data = await Promise.all([
            Guestbook.find({}, {}, options).exec(),
            Guestbook.countDocuments({}).exec()
        ]);
        comments = data[0];
        count = data[1];
        pageCount = Math.ceil(count / pageSize);
    } catch (err) {
        console.error(err);
    }
    return {
        comments,
        count,
        hasNext: pageCount > page
    };
}

async function saveGuestbook (params) {
    const entity = new Guestbook({
        username: badWords.filter(params.username),
        website: params.website,
        content: badWords.filter(params.content),
        createTime: new Date()
    });
    const comment = await entity.save();
    return {
        comment
    };
}

async function getSettings () {
    const settings = await Setting.findOne().exec();
    return {
        settings
    };
}

export default {
    getCategories,
    getPosts,
    getPopArticles,
    getPopLabels,
    getArticle,
    getPostsCountByCate,
    increaseViews,
    getComments,
    saveComment,
    getGuestbook,
    saveGuestbook,
    getSettings
};
