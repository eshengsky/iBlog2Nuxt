import DB from "../db";
const { Category, Post, Comment, Guestbook, Setting } = DB.Models;
import mongoose from "mongoose";
import { otherCategoryItem } from "../models/category";

async function getCategories() {
  const categories = await Category.find(
    {},
    {},
    { sort: "sequence cateName" }
  ).exec();
  return categories;
}

const getPosts = async (params: any) => {
  const matchObj: any = {};
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
    matchObj.category = mongoose.Types.ObjectId(category);
  }
  if (title) {
    matchObj.title = { $regex: title, $options: "gi" };
  }
  if (content) {
    matchObj.$or = [
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
    matchObj.labels = { $regex: label, $options: "gi" };
  }
  if (
    Array.isArray(createTime) &&
    createTime.length === 2 &&
    createTime[0] &&
    createTime[1]
  ) {
    const start = new Date(createTime[0]);
    const end = new Date(createTime[1]);
    matchObj.createTime = { $gt: start, $lt: end };
  }
  if (
    Array.isArray(modifyTime) &&
    modifyTime.length === 2 &&
    modifyTime[0] &&
    modifyTime[1]
  ) {
    const start = new Date(modifyTime[0]);
    const end = new Date(modifyTime[1]);
    matchObj.modifyTime = { $gt: start, $lt: end };
  }
  if (isLink === "1" || isLink === "-1") {
    matchObj.isLocal = isLink === "-1";
  }
  if (isDraft === "1" || isDraft === "-1") {
    matchObj.isDraft = isDraft === "1";
  }
  if (isDeleted === "1" || isDeleted === "-1") {
    matchObj.isActive = isDeleted === "-1";
  }
  if (hasComments === "1" || hasComments === "-1") {
    matchObj.comments = {
      [hasComments === "1" ? "$gt" : "$eq"]: []
    };
  }

  // 排序
  let sortObj: any = {
    createTime: -1
  };
  if (params.sortBy) {
    sortObj = {
      [params.sortBy]: params.order === "descend" ? -1 : 1
    };
  }
  if (params.sortBy !== "createTime") {
    sortObj.createTime = -1;
  }

  const page = parseInt(params.pageIndex);
  const pageSize = parseInt(params.pageSize);
  const aggregate = [
    {
      // 关联分类集合
      $lookup: {
        from: "category",
        localField: "category",
        foreignField: "_id",
        as: "categories"
      }
    },
    {
      // 关联评论集合
      $lookup: {
        from: "comment",
        localField: "_id",
        foreignField: "post",
        as: "comments"
      }
    },
    {
      // 额外添加一个评论数字段
      $addFields: {
        commentsCount: { $size: "$comments" }
      }
    },
    {
      // 关联之后，再去筛选
      $match: matchObj
    },
    {
      // 筛选之后，再去排序
      $sort: sortObj
    },
    {
      $project: {
        content: 0,
        "categories.img": 0
      }
    }
  ];

  const data = await Promise.all([
    Post.aggregate(aggregate)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec(),
    Post.aggregate(aggregate)
      .count("totalCount")
      .exec()
  ]);
  return {
    postList: data[0],
    count: data[1].length === 0 ? 0 : data[1][0].totalCount
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
  const article = await Post.findByIdAndUpdate(uid, params, {
    new: true
  }).exec();
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

// 永久删除文章，对应的评论也要删除
const delete2Article = async uid => {
  const article = await Post.findByIdAndDelete(uid);
  const result = await Promise.all([
    Post.findByIdAndDelete(uid).exec(),
    Comment.deleteMany({ post: uid }).exec()
  ]);
  return {
    result
  };
};

const checkArticleAlias = async ({ alias, excludeUid }) => {
  const filter: any = {};
  filter.alias = alias;
  if (excludeUid) {
    filter._id = { $ne: excludeUid };
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
    filter._id = { $ne: excludeUid };
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
    category: new Category()
  };
};

const editCategory = async (uid, params) => {
  params.modifyTime = new Date();
  const category = await Category.findByIdAndUpdate(uid, params, {
    new: true
  }).exec();
  return {
    category
  };
};

const deleteCategory = async (uids: Array<string> | string) => {
  if (!Array.isArray(uids)) {
    uids = [uids];
  }
  const result = await Promise.all([
    Category.deleteMany({ _id: { $in: uids } }).exec(),
    Post.updateMany(
      { category: { $in: uids } },
      { category: otherCategoryItem._id.toHexString() }
    ).exec()
  ]);
  return {
    result
  };
};

const getComments = async params => {
  const page = parseInt(params.pageIndex || "1");
  const pageSize = parseInt(params.pageSize || "10");
  const options: any = {};
  options.skip = (page - 1) * pageSize;
  options.limit = pageSize;
  options.sort = `${params.order === "descend" ? "-" : ""}${params.sortBy}`;
  const query: any = {};
  if (params.title) {
    query["post.title"] = { $regex: params.title, $options: "gi" };
  }
  if (params.username) {
    query.username = { $regex: params.username, $options: "gi" };
  }
  if (params.content) {
    query.content = { $regex: params.content, $options: "gi" };
  }
  if (
    Array.isArray(params.createTime) &&
    params.createTime.length === 2 &&
    params.createTime[0] &&
    params.createTime[1]
  ) {
    const start = new Date(params.createTime[0]);
    const end = new Date(params.createTime[1]);
    query.createTime = { $gt: start, $lt: end };
  }
  const data = await Promise.all([
    Comment.find(query, {}, options)
      .populate({
        path: "post",
        select: "-content",
        populate: {
          path: "category",
          select: "-img"
        }
      })
      .exec(),
    Comment.countDocuments(query).exec()
  ]);
  return {
    comments: data[0],
    count: data[1]
  };
};

const deleteComment = async (uids: Array<string> | string) => {
  if (!Array.isArray(uids)) {
    uids = [uids];
  }
  const result = await Comment.deleteMany({ _id: { $in: uids } }).exec();
  return {
    result
  };
};

const getGuestbook = async params => {
  const page = parseInt(params.pageIndex || "1");
  const pageSize = parseInt(params.pageSize || "10");
  const options: any = {};
  options.skip = (page - 1) * pageSize;
  options.limit = pageSize;
  options.sort = `${params.order === "descend" ? "-" : ""}${params.sortBy}`;
  const query: any = {};
  if (params.username) {
    query.username = { $regex: params.username, $options: "gi" };
  }
  if (params.content) {
    query.content = { $regex: params.content, $options: "gi" };
  }
  if (
    Array.isArray(params.createTime) &&
    params.createTime.length === 2 &&
    params.createTime[0] &&
    params.createTime[1]
  ) {
    const start = new Date(params.createTime[0]);
    const end = new Date(params.createTime[1]);
    query.createTime = { $gt: start, $lt: end };
  }
  const data = await Promise.all([
    Guestbook.find(query, {}, options).exec(),
    Guestbook.countDocuments(query).exec()
  ]);
  return {
    comments: data[0],
    count: data[1]
  };
};

const deleteGuestbook = async (uids: Array<string> | string) => {
  if (!Array.isArray(uids)) {
    uids = [uids];
  }
  const result = await Guestbook.deleteMany({ _id: { $in: uids } }).exec();
  return {
    result
  };
};

const saveSettings = async params => {
  const settings = await Setting.findOneAndUpdate({}, params, {
    new: true
  }).exec();
  return {
    settings
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
  deleteCategory,
  getComments,
  deleteComment,
  getGuestbook,
  deleteGuestbook,
  saveSettings
};
