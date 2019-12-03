import { Schema, model, models, Document, Model, Types } from "mongoose";
import url from "url";
import moment from "moment";
import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";
import hljs from "highlight.js";
import { ICategory } from "./category";

export interface IPost extends Document {
  _id: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 文章别名
   */
  alias: string;

  /**
   * 内容
   */
  content: string;

  /**
   * 分类
   */
  category: ICategory;

  /**
   * 标签
   */
  labels: Array<string>;

  /**
   * 外链Url
   */
  url: string;

  /**
   * 浏览次数
   */
  viewCount: number;

  /**
   * 是否本地文档，否则是外链
   */
  isLocal: boolean;

  /**
   * 是否草稿
   */
  isDraft: boolean;

  /**
   * 是否有效
   */
  isActive: boolean;

  /**
   * 创建时间
   */
  createTime: Date;

  /**
   * 修改时间
   */
  modifyTime: Date;
}

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

    // 虚拟字段：外链主机名
    schema.virtual("host").get(function(this: any) {
      return this.url ? url.parse(this.url).host : "";
    });

    // 虚拟字段：html
    schema.virtual("html").get(function(this: any) {
      if (this.content) {
        const md = new MarkdownIt({
          html: true,
          linkify: true,
          highlight: function(str, lang) {
            let showLang = "";
            let code = "";
            if (lang) {
              showLang = lang.toUpperCase();
              if (showLang === "JS") {
                showLang = "JAVASCRIPT";
              } else if (showLang === "TS") {
                showLang = "TYPESCRIPT";
              }
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
        }).use(MarkdownItAnchor, {
          permalink: true,
          permalinkBefore: true,
          permalinkSymbol: `<svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`
        });
        return md.render(this.content);
      }
      return "";
    });

    // 虚拟字段：文章评论
    schema.virtual("comments", {
      ref: "comment",
      foreignField: "post",
      localField: "_id"
    });

    if (models["post"]) {
      this._model = models["post"];
    } else {
      this._model = model<IPost>("post", schema, "post");
    }
  }

  public get model(): Model<IPost> {
    return this._model;
  }
}
