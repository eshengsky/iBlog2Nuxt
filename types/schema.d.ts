import { Document, Model } from 'mongoose';

export interface IAuth extends Document {
    _id: string;
    password: string;
    createTime: Date;
    modifyTime: Date;
}

export interface ICategory extends Document {
    _id: string;
    cateName: string;
    alias: string;
    img: string;
    sequence: number;
    createTime: Date;
    modifyTime: Date;
}

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
     * 是否允许评论的标识
     */
    commentsFlag: number;

    /**
   * 创建时间
   */
    createTime: Date;

    /**
   * 修改时间
   */
    modifyTime: Date;

    /**
     *发布时间
     */
    publishTime: Date;
}

export interface IComment extends Document {
    post: IPost;
    username: string;
    website?: string;
    content: string;
    createTime: Date;
}

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

export interface ISetting extends Document {
    _id: string;

    /**
   * 博客名称
   */
    blogName: string,

    /**
   * 博客标语
   */
    blogSlogan: string,

    /**
   * 博客logo，显示于网站左上角
   */
    blogLogo: string,

    /**
     * 备案信息
     */
    recordInfo: string,

    /**
   * 是否显示博客简介
   */
    showBlogIntro: boolean,

    /**
   * 博客简介内容
   */
    blogIntro: string,

    /**
   * 首页的每页展示文章条数
   */
    postPageSize: number,

    /**
   * 是否开启预览功能
   */
    enablePreview: boolean,

    /**
   * 是否显示文章底部版权信息
   */
    showLicense: boolean,

    /**
     * 是否允许文章评论
     */
    enableComments: boolean,

    /**
   * 评论及留言每页条数
   */
    commentPageSize: 20,

    /**
   * 是否开启百度统计功能
   */
    enableStatistics: boolean,

    /**
   * 百度统计Key
   */
    statisticsKey: string
}