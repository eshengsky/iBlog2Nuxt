import { Schema, model, models, Document, Model } from "mongoose";
import { IPost } from "./post";
import moment from "moment";

interface IComment extends Document {
  post: IPost;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  createTime: Date;
}

export { IComment };

export interface ICommentModel extends Model<IComment> {}

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

export { schema };

export class Comment {
  private _model: Model<IComment>;

  constructor() {
    if (models["comment"]) {
      this._model = models["comment"];
    } else {
      schema.add({
        post: { type: Schema.Types.ObjectId, ref: "post" },
      });
      this._model = model<IComment>("comment", schema, "comment");
    }
  }

  public get model(): Model<IComment> {
    return this._model;
  }
}
