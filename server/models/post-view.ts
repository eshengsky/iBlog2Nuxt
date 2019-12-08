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

export interface IPostViewModel extends Model<IPostView> { }

export class PostView {
    private _model: Model<IPostView>;

    constructor() {
        const schema = new Schema({
            postID: { type: Types.ObjectId },
            clientIP: { type: String },
            createTime: { type: Date, default: new Date(), expires: 10 }
        });

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
