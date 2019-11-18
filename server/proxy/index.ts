import DB from "../db";
import { ICategoryModel, ICategory } from "../models/category";
import { IComment } from "../models/comment";
import { IPost } from "../models/post";
const { Post, Category, Guestbook } = DB.Models;
const pageSize = 3;

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
  try {
    page = parseInt(params.pageIndex) || 1;
    page = page > 0 ? page : 1;
    const options: any = {};
    options.skip = (page - 1) * pageSize;
    options.limit = pageSize;
    options.sort =
      params.sortBy === "title" ? "title -createTime" : "-createTime";
    const query = getPostsQuery(params);
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

async function saveComment(params, user) {
  const articleId = params.articleId;
  const content = params.content;
  const entity = await Post.findById(articleId).exec();
  if (!entity) {
    throw new Error(`未找到评论数据！`);
  }
  const username = user.username;
  const displayName = user.displayName;
  const avatar = user._json.avatar_url;
  const now = new Date();
  entity.comments.unshift({
    username,
    displayName,
    avatar,
    content,
    createTime: now
  } as IComment);
  const article = await entity.save();
  return {
    article
  };
}

async function getGuestbook() {
  let guestbook;
  try {
    guestbook = await Guestbook.find()
      .sort("-createTime")
      .exec();
  } catch (err) {
    console.error(err);
  }
  return {
    guestbook
  };
}

async function saveGuestbook(params, user) {
  try {
    const username = user.username;
    const displayName = user.displayName;
    const avatar = user._json.avatar_url;
    const content = params.content;
    const now = new Date();
    const item = {
      username,
      displayName,
      avatar,
      content,
      createTime: now
    } as IComment;
    const newItem = new Guestbook(item);
    const guestbookItem = await newItem.save();
    return {
        guestbookItem
    }
  } catch (err) {
    console.error(err);
  }
}

export default {
  getCategories,
  getPosts,
  getArticle,
  saveComment,
  getGuestbook,
  saveGuestbook
};
