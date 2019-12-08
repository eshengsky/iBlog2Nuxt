import { connect, connection, Connection } from "mongoose";
import { Post, IPostModel } from "./models/post";
import { PostView, IPostView, IPostViewModel } from "./models/post-view";
import { Category, ICategoryModel } from "./models/category";
import { Comment, ICommentModel } from "./models/comment";
import { Guestbook, IGuestbookModel } from "./models/guestbook";
import { Setting, ISettingModel } from "./models/setting";
import { Auth, IAuthModel } from "./models/auth";
import config from "../blog.config";

interface IModels {
  Post: IPostModel;
  PostView: IPostViewModel;
  Category: ICategoryModel,
  Comment: ICommentModel,
  Guestbook: IGuestbookModel,
  Setting: ISettingModel,
  Auth: IAuthModel
}

export default class DB {
  private static instance: DB;

  private _db: Connection;
  private _models: IModels;

  private constructor() {
    // 连接 MongoDB
    connect(
      config.mongoUrl,
      { 
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      },
      () => {
        // 设置默认数据
        (this._models.Category as any).initData();
        (this._models.Setting as any).initData();
      }
    );
    this._db = connection;
    this._db.once("open", this.connected);
    this._db.on("error", this.error);

    this._models = {
      Post: new Post().model,
      PostView: new PostView().model,
      Category: new Category().model,
      Comment: new Comment().model,
      Guestbook: new Guestbook().model,
      Setting: new Setting().model,
      Auth: new Auth().model
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
