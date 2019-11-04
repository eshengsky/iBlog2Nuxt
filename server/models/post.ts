import { Schema, model, Document, Model, Types } from "mongoose";
import url from "url";
import moment from "moment";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import CommentSchema, {IComment} from "./comment";

interface IPost extends Document {
  _id: string;
  title: string;
  alias: string;
  summary?: string;
  content?: string;
  category: Schema.Types.ObjectId;
  labels?: Array<string>;
  url?: string;
  viewCount: number;
  isLocal: boolean;
  isDraft: boolean;
  isActive: boolean;
  comments: Types.DocumentArray<IComment>;
}

export { IPost };

export interface IPostModel extends Model<IPost> {}

export class Post {
  private _model: Model<IPost>;

  constructor() {
    const schema = new Schema(
      {
        // 标题
        title: { type: String },

        // 文章别名
        alias: { type: String, unique: true },

        // 摘要
        summary: { type: String },

        // 内容
        content: { type: String },

        // 分类
        category: { type: Schema.Types.ObjectId, ref: "category" },

        // 标签
        labels: { type: Array },

        // 外链Url
        url: { type: String },

        // 浏览次数
        viewCount: { type: Number, default: 0 },

        // 是否本地文档，否则是外链
        isLocal: { type: Boolean, default: true },

        // 是否草稿
        isDraft: { type: Boolean, default: false },

        // 是否有效
        isActive: { type: Boolean, default: true },

        // 评论列表
        comments: [CommentSchema],

        // 创建时间
        createTime: { type: Date, default: new Date() },

        // 修改时间
        modifyTime: { type: Date, default: new Date() }
      },
      {
        // 设置查询时默认返回虚拟字段
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
      }
    );
    // 虚拟字段：发布日期
    schema.virtual("publishDate").get(function(this: any) {
      return moment(this.createTime).format("YYYY-MM-DD");
    });

    // 虚拟字段：创建时间字符串
    schema.virtual("createTimeStr").get(function(this: any) {
      return moment(this.createTime).format("YYYY-MM-DD hh:mm");
    });

    // 虚拟字段：修改时间字符串
    schema.virtual("modifyTimeStr").get(function(this: any) {
      return moment(this.modifyTime).format("YYYY-MM-DD hh:mm");
    });

    // 虚拟字段：外链主机名
    schema.virtual("host").get(function(this: any) {
      return this.url ? url.parse(this.url).host : "";
    });

    // 虚拟字段：html
    schema.virtual("html").get(function(this: any) {
      if (this.content) {
        const md = new MarkdownIt({
          highlight: function(str, lang) {
            let showLang = "";
            let code = "";
            if (lang) {
              showLang = lang.toUpperCase();
              try {
                code = hljs.highlight(lang, str, true).value;
              } catch (err) {}
            }
            if (!code) {
              code = md.utils.escapeHtml(str);
            }
            return (
              '<pre class="hljs"><div class="pre-header"><div class="pre-header-left"><div></div><div></div><div></div></div><div class="pre-header-right">' +
              showLang +
              "</div></div><code>" +
              code +
              "</code></pre>"
            );
          }
        });
        return md.render(this.content);
      }
      return "";
    });

    this._model = model<IPost>("post", schema, "post");
  }

  public get model(): Model<IPost> {
    return this._model;
  }
}
