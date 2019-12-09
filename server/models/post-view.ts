import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IPostView extends Document {
  _id: string;

  /**
   * 文章ID
   */
  postID: Types.ObjectId;

  /**
   * 客户端IP地址
   */
  clientIP: string;

  /**
   * 创建时间
   */
  createTime: Date;
}

export interface IPostViewModel extends Model<IPostView> {}

export class PostView {
  private _model: Model<IPostView>;

  constructor() {
    const schema = new Schema({
      postID: { type: Types.ObjectId },
      clientIP: { type: String },
      createTime: { type: Date, default: new Date(), expires: 3600 }
    });

    // 只有当model不存在时才创建model，主要是为了兼容开发模式下的HotReload
    if (models["postView"]) {
      this._model = models["postView"];
    } else {
      this._model = model<IPostView>("postView", schema, "postView");
    }
  }

  public get model(): Model<IPostView> {
    return this._model;
  }
}
