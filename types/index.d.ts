export interface IBlogConfig {
    /**
   * MongoDB链接
   */
    mongoUrl: string;

    /**
   * JWT秘钥
   */
    jwtSecret: string;
}

export interface IResp {
    /** 响应 code */
    code: 1 | -1 | -2;

    /** 响应数据 */
    data?: any;

    /** 错误消息 */
    message?: string;
}

declare module 'vue/types/vue' {
    interface Vue {
        $bus: Vue;
    }
}
