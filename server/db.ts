import { connect, connection, Connection } from "mongoose";
import { Post, IPostModel } from "./models/post";
import { Category, ICategoryModel } from "./models/category";
import { Guestbook, IGuestbookModel } from "./models/guestbook";
import config from "../blog.config";

interface IModels {
  Post: IPostModel;

  Category: ICategoryModel,
  Guestbook: IGuestbookModel
}

export default class DB {
  private static instance: DB;

  private _db: Connection;
  private _models: IModels;

  private constructor() {
    connect(
      config.mongoUrl,
      { 
        useNewUrlParser: true,
        useCreateIndex: true
      }
    );
    this._db = connection;
    this._db.once("open", this.connected);
    this._db.on("error", this.error);

    this._models = {
      Post: new Post().model,
      Category: new Category().model,
      Guestbook: new Guestbook().model
    };
  }

  public static get Models() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance._models;
  }

  private connected() {
    console.log("Mongoose has connected");
  }

  private error(error) {
    console.error("Mongoose has errored", error);
  }
}
