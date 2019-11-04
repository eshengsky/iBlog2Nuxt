import { Schema, model, Document, Model } from "mongoose";

interface ICategory extends Document {
  _id: string;
  cateName: string;
  alias: string;
  img: string;
  link: string;
}

export {ICategory};

export interface ICategoryModel extends Model<ICategory> {}

export class Category {
  private _model: Model<ICategory>;

  constructor() {
    const schema = new Schema({
      // 分类名称
      cateName: { type: String },

      // 分类别名
      alias: { type: String },

      // 图标地址
      img: { type: String },

      // 链接地址
      link: { type: String }
    });
    this._model = model<ICategory>("category", schema, "category");
  }

  public get model(): Model<ICategory> {
    return this._model;
  }
}
