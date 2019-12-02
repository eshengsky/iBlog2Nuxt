export interface IBlogConfig {
  /**
   * MongoDB链接
   */
  mongoUrl: string;

  /**
   * Github ClientID
   */
  githubClientID: string;

  /**
   * Github Client Secret
   */
  githubClientSecret: string;

  /**
   * Github 身份验证回调地址
   */
  githubCallbackURL: string;

  /**
   * 后台管理系统账号，配置为你自己的Github用户名
   */
  githubAdmin: string;
}

declare module "vue/types/vue" {
  interface Vue {
    $bus: Vue;
  }
}
