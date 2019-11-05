import DB from "../db";
import { noCategory } from "../models/category";
const { Category, Post, Guestbook } = DB.Models;

interface IPostParams {
  pageIndex: string;
  pageSize: string;
  sortBy: string;
  order: "asc" | "desc";
  cateId: string | undefined;
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
  const { cateId, title, content, label, createTime, modifyTime, isLink, isDraft, hasComments, isDeleted } = params;
  if (cateId) {
    query.category = cateId;
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
  if (isLink === '1' || isLink === '-1') {
    query.isLocal = isLink === '-1';
  }
  if (isDraft === '1' || isDraft === '-1') {
    query.isDraft = isDraft === '1';
  }
  if (isDeleted === '1' || isDeleted === '-1') {
    query.isActive = isDeleted === '-1';
  }
  if (hasComments === '1' || hasComments === '-1') {
    query.comments = {
      [hasComments === '1' ? '$gt' : '$eq']: []
    }
  }
  return query;
}

async function getCategories() {
  const categories = await Category.find().exec();
  categories.push(noCategory);
  return categories;
}

const getPosts = async (params: IPostParams) => {
  const page = parseInt(params.pageIndex);
  const pageSize = parseInt(params.pageSize);
  const options: any = {};
  options.skip = (page - 1) * pageSize;
  options.limit = pageSize;
  options.sort = `${params.order === "desc" ? "-" : ""}${params.sortBy}`;
  const query = getPostsQuery(params);
  const data = await Promise.all([
    Post.find(query, {}, options)
      .populate("category")
      .exec(),
    Post.countDocuments(query).exec()
  ]);
  return {
    postList: data[0],
    count: data[1]
  };
};

export default {
  getCategories,
  getPosts
};
