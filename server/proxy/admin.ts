import DB from "../db";
import { IPost } from "../models/post";
const { Category, Post, Guestbook } = DB.Models;
import mongoose from "mongoose";
import { otherCategoryItem } from "../models/category";

interface IPostParams {
  pageIndex: string;
  pageSize: string;
  sortBy: string;
  order: "ascend" | "descend";
  category: string | undefined;
  title: string;
  content: string;
  label: string;
  createTime: [string, string];
  modifyTime: [string, string];
  isLink: string | undefined;
  isDraft: string | undefined;
  hasComments: string | undefined;
  isDeleted: string | undefined;
}

/**
 * 为后台列表数据查询构建条件对象
 * @param params 查询参数对象
 */
function getPostsQuery(params: IPostParams) {
  const query: any = {};
  const {
    category,
    title,
    content,
    label,
    createTime,
    modifyTime,
    isLink,
    isDraft,
    hasComments,
    isDeleted
  } = params;
  if (category) {
    query.category = category;
  }
  if (title) {
    query.title = { $regex: title, $options: "gi" };
  }
  if (content) {
    query.$or = [
      {
        title: {
          $regex: content,
          $options: "gi"
        }
      },
      {
        summary: {
          $regex: content,
          $options: "gi"
        }
      },
      {
        content: {
          $regex: content,
          $options: "gi"
        }
      }
    ];
  }
  if (label) {
    query.labels = { $regex: label, $options: "gi" };
  }
  if (
    Array.isArray(createTime) &&
    createTime.length === 2 &&
    createTime[0] &&
    createTime[1]
  ) {
    const start = new Date(createTime[0]);
    const end = new Date(createTime[1]);
    query.createTime = { $gt: start, $lt: end };
  }
  if (
    Array.isArray(modifyTime) &&
    modifyTime.length === 2 &&
    modifyTime[0] &&
    modifyTime[1]
  ) {
    const start = new Date(modifyTime[0]);
    const end = new Date(modifyTime[1]);
    query.modifyTime = { $gt: start, $lt: end };
  }
  if (isLink === "1" || isLink === "-1") {
    query.isLocal = isLink === "-1";
  }
  if (isDraft === "1" || isDraft === "-1") {
    query.isDraft = isDraft === "1";
  }
  if (isDeleted === "1" || isDeleted === "-1") {
    query.isActive = isDeleted === "-1";
  }
  if (hasComments === "1" || hasComments === "-1") {
    query.comments = {
      [hasComments === "1" ? "$gt" : "$eq"]: []
    };
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

const getPosts = async (params: IPostParams) => {
  const page = parseInt(params.pageIndex);
  const pageSize = parseInt(params.pageSize);
  const options: any = {};
  options.skip = (page - 1) * pageSize;
  options.limit = pageSize;
  options.sort = `${params.order === "descend" ? "-" : ""}${params.sortBy}`;
  const query = getPostsQuery(params);
  const data = await Promise.all([
    Post.find(query, "-content", options)
      .populate("category")
      .exec(),
    Post.countDocuments(query).exec()
  ]);
  return {
    postList: data[0],
    count: data[1]
  };
};

const getArticle = async uid => {
  if (!mongoose.Types.ObjectId.isValid(uid)) {
    return null;
  }
  const article = await Post.findById(uid).exec();
  return article;
};

const newArticle = async params => {
  const now = new Date();
  const entity = new Post({
    createTime: now,
    modifyTime: now,
    ...params
  });
  const newArticle = await entity.save();
  return {
    article: newArticle
  };
};

const editArticle = async (uid, params) => {
  params.modifyTime = new Date();
  const article = await Post.findByIdAndUpdate(uid, params, { new: true }).exec();
  return {
    article
  };
};

const deleteArticle = async (uids: Array<string> | string) => {
  if (!Array.isArray(uids)) {
    uids = [uids];
  }
  const result = await Post.updateMany(
    { _id: { $in: uids } },
    { isActive: false }
  ).exec();
  return {
    result
  };
};

const delete2Article = async uid => {
  const article = await Post.findByIdAndDelete(uid);
  return {
    article
  }
};

const checkArticleAlias = async ({ alias, excludeUid }) => {
  const filter: any = {};
  filter.alias = alias;
  if (excludeUid) {
    filter._id = { $ne: excludeUid }
  }
  const exists = await Post.exists(filter);
  return {
    exists
  };
};

const checkCategoryAlias = async ({ alias, excludeUid }) => {
  const filter: any = {};
  filter.alias = alias;
  if (excludeUid) {
    filter._id = { $ne: excludeUid }
  }
  const exists = await Category.exists(filter);
  return {
    exists
  };
};

const newCategory = async params => {
  const now = new Date();
  const entity = new Category({
    createTime: now,
    modifyTime: now,
    ...params
  });
  const newCategory = await entity.save();
  return {
    category: new Category
  }
}

const editCategory = async (uid, params) => {
  params.modifyTime = new Date();
  const category = await Category.findByIdAndUpdate(uid, params, { new: true }).exec();
  return {
    category
  }
}

const deleteCategory = async (uids: Array<string> | string) => {
  if (!Array.isArray(uids)) {
    uids = [uids];
  }
  const result = await Promise.all([
    Category.deleteMany({ _id: { $in: uids }}).exec(),
    Post.updateMany({ category: { $in: uids } }, { category: otherCategoryItem._id.toHexString() }).exec()
  ]); 
  return {
    result
  };
};

export default {
  getCategories,
  getArticle,
  getPosts,
  newArticle,
  editArticle,
  deleteArticle,
  delete2Article,
  checkArticleAlias,
  checkCategoryAlias,
  newCategory,
  editCategory,
  deleteCategory
};
