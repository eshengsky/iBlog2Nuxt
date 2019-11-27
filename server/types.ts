interface IResp {
  /** 响应 code */
  code: 1 | -1 | -2;

  /** 响应数据 */
  data?: any;

  /** 错误消息 */
  message?: string;
}

export { IResp };
