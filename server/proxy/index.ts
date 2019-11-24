import DB from "../db";
import { ICategoryModel, ICategory } from "../models/category";
import { IComment } from "../models/comment";
import { IPost } from "../models/post";
import { ISetting } from "../models/setting";
import BadWords from "../bad_words/index";
const { Post, Category, Comment, Guestbook, Setting } = DB.Models;

/**
 * 为首页数据查询构建条件对象
 * @param params 查询参数对象
 */
function getPostsQuery(params) {
  const query: any = {};
  query.isActive = true;
  query.isDraft = false;
  if (params.category) {
    query.category = params.category;
  }
  const keyword = params.keyword;
  if (keyword) {
    switch (params.filterType) {
      case "title":
        query.title = { $regex: keyword, $options: "gi" };
        break;
      case "tag":
        query.labels = { $regex: keyword, $options: "gi" };
        break;
      case "date":
        if (
          Array.isArray(keyword) &&
          keyword.length === 2 &&
          keyword[0] &&
          keyword[1]
        ) {
          const start = new Date(keyword[0]);
          const end = new Date(keyword[1]);
          query.createTime = { $gt: start, $lt: end };
        }
        break;
      default:
        query.$or = [
          {
            title: {
              $regex: keyword,
              $options: "gi"
            }
          },
          {
            labels: {
              $regex: keyword,
              $options: "gi"
            }
          },
          {
            summary: {
              $regex: keyword,
              $options: "gi"
            }
          },
          {
            content: {
              $regex: keyword,
              $options: "gi"
            }
          }
        ];
    }
  }
  return query;
}

async function getCategories() {
  const categories = await Category.find(
    {},
    {},
    { sort: "sequence cateName" }
  ).exec();
  return categories;
}

async function getPosts(params) {
  let page = 1;
  let postList: any[] = [];
  let pageCount = 0;
  let count = 0;
  const pageSize = parseInt(params.pageSize);
  try {
    page = parseInt(params.pageIndex) || 1;
    page = page > 0 ? page : 1;
    const options: any = {};
    options.skip = (page - 1) * pageSize;
    options.limit = pageSize;
    options.sort =
      params.sortBy === "title" ? "title -createTime" : "-createTime";
    const query = getPostsQuery(params);
    //   db.post.aggregate([
    //     {
    //         $lookup: {
    //             from: "comment",
    //             localField: "_id",
    //             foreignField: "post",
    //             as: "comments"
    //         }
    //     }
    // ])
    const data = await Promise.all([
      Post.find(query, {}, options)
        .populate("category")
        .exec(),
      Post.countDocuments(query).exec()
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

async function getPopArticles() {
  const articles = await Post.find({}, "-content", {
    sort: "-viewCount",
    limit: 7
  })
    .populate("category")
    .exec();
  return {
    articles
  };
}

async function getPopLabels() {
  const labels = await Post.aggregate([{
    $unwind: "$labels"
  }, {
    $group: {
      _id: "$labels",
      count: { $sum: 1 }
    }
  }, {
    $sort: { count: -1, _id: 1 }
  }, {
    $limit: 10
  }]).exec();
  return {
    labels
  }
}

async function getArticle(params) {
  let article;
  try {
    const alias = params.alias;
    article = await Post.findOne({ alias }).exec();
  } catch (err) {
    console.error(err);
  }
  return article;
}

async function getComments(params) {
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
    options.sort = "-createTime";
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

async function saveComment(params) {
  const entity = new Comment({
    post: params.articleId,
    username: BadWords.filter(params.username),
    website: params.website,
    email: params.email,
    content: BadWords.filter(params.content),
    createTime: new Date()
  });
  const comment = await entity.save();
  return {
    comment
  };
}

async function getGuestbook(params) {
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
    options.sort = "-createTime";
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

async function saveGuestbook(params) {
  const entity = new Guestbook({
    username: BadWords.filter(params.username),
    website: params.website,
    email: params.email,
    content: BadWords.filter(params.content),
    createTime: new Date()
  });
  const comment = await entity.save();
  return {
    comment
  };
}

async function getSettings() {
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
  getComments,
  saveComment,
  getGuestbook,
  saveGuestbook,
  getSettings
};
