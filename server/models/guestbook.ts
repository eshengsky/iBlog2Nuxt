import { model, models, Document, Model } from "mongoose";
import CommentSchema, { IComment } from "./comment";

export interface IGuestbookModel extends Model<IComment> {}

export class Guestbook {
  private _model: Model<IComment>;

  constructor() {
    if (models["guestbook"]) {
      this._model = models["guestbook"];
    } else {
      this._model = model<IComment>("guestbook", CommentSchema, "guestbook");
    }
  }

  public get model(): Model<IComment> {
    return this._model;
  }
}