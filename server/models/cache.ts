import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface ICache extends Document {
  _id: string;

  /**
   * 客户端IP地址
   */
  clientIP: string;

  /**
   * 扩展字段1
   */
  ext1: any,

  /**
   * 扩展字段2
   */
  ext2: any,

  /**
   * 扩展字段3
   */
  ext3: any,

  /**
   * 创建时间
   */
  createTime: Date;
}

export interface ICacheModel extends Model<ICache> {}

export class Cache {
  private _model: Model<ICache>;

  constructor() {
    const schema = new Schema({
      clientIP: { type: String },
      ext1: { type: Schema.Types.Mixed },
      ext2: { type: Schema.Types.Mixed },
      ext3: { type: Schema.Types.Mixed },
      createTime: { type: Date, default: new Date(), expires: 3600 }
    });

    // 只有当model不存在时才创建model，主要是为了兼容开发模式下的HotReload
    if (models["cache"]) {
      this._model = models["cache"];
    } else {
      this._model = model<ICache>("cache", schema, "cache");
    }
  }

  public get model(): Model<ICache> {
    return this._model;
  }
}
