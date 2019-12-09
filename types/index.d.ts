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

declare module 'vue/types/vue' {
    interface Vue {
        $bus: Vue;
    }
}
