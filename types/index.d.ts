export interface IBlogConfig {
    /**
     * MongoDB链接
     */
    mongoUrl: string;

    /**
     * 后台管理系统账号，配置为你的Github用户名
     */
    adminGithubUser: string;
}
