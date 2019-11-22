import { model, models, Model } from "mongoose";
import { schema, IComment } from "./comment";

export interface IGuestbookModel extends Model<IComment> {}

export class Guestbook {
  private _model: Model<IComment>;

  constructor() {
    if (models["guestbook"]) {
      this._model = models["guestbook"];
    } else {
      this._model = model<IComment>("guestbook", schema, "guestbook");
    }
  }

  public get model(): Model<IComment> {
    return this._model;
  }
}
