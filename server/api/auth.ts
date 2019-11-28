import express from "express";
import jwt from "express-jwt";
import jsonwebtoken from "jsonwebtoken";
import proxy from "../proxy/auth";
import { IResp } from "../types";

const app = express();

app.use(
  jwt({
    secret: "iBlog2JsonWebTokenSecretKey123"
  }).unless({
    path: ["/auth/api/login", "/auth/api/exists", "/auth/api/account"]
  })
);

// 判断账户是否存在（是否已初始化）
app.get("/exists", async (req, res, next) => {
  let resp: IResp;
  try {
    const data = await proxy.existsAccount();
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1
    };
  }
  res.json(resp);
});

// 初始化账户
app.put("/account", async (req, res, next) => {
  let resp: IResp;
  try {
    const data = await proxy.newAccount(req.body);
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1
    };
  }
  res.json(resp);
});

// 修改密码
app.post("/account", async (req, res, next) => {
  const resp = await proxy.changePassword(req.body);
  res.json(resp);
});

// 获取当前用户
app.get("/user", (req, res, next) => {
  res.json({ user: (req as any).user });
});

// 提交登录请求
app.post("/login", async (req, res, next) => {
  try {
    const data = await proxy.findAccount(req.body);
    if (!data.account) {
      return res.sendStatus(401);
    }

    const accessToken = jsonwebtoken.sign(
      {
        username: "Admin"
      },
      "iBlog2JsonWebTokenSecretKey123"
    );

    res.json({
      token: {
        accessToken
      }
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// 退出登录
app.post("/logout", (req, res, next) => {
  res.json({
    code: 1
  });
});

// 异常处理
app.use((err, req, res, next) => {
  res.sendStatus(err.status || 500);
});

export default {
  path: "/auth/api",
  handler: app
};