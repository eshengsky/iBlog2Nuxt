import { Schema, Document, Types } from "mongoose";
import moment from "moment";

interface IComment extends Document {
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  createTime: Date;
}

export { IComment };

const schema = new Schema(
  {
    // 评论者用户名
    username: { type: String },

    // 评论者显示名
    displayName: { type: String },

    // 评论者头像地址
    avatar: { type: String },

    // 评论内容
    content: { type: String },

    // 创建时间
    createTime: { type: Date, default: new Date() }
  },
  {
    // 设置查询时默认返回虚拟字段
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// 虚拟字段：评论时间字符串
schema.virtual("commentTimeStr").get(function(this: any) {
  return moment(this.createTime).format("YYYY-MM-DD hh:mm:ss");
});
export default schema;
