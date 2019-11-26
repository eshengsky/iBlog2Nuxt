import express from "express";
import jsonwebtoken from "jsonwebtoken";
import proxy from "../proxy/auth";
import { IResp } from "../types";

const app = express();

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

app.get("/user", (req, res, next) => {
  res.json({ user: (req as any).user })
});

app.post("/login", async (req, res, next) => {
  try {
    const data = await proxy.findAccount(req.body);
    if (!data.account) {
      return res.sendStatus(401);
    }

    const accessToken = jsonwebtoken.sign(
      {
        username: "Admin",
        picture: 'https://github.com/nuxt.png',
        name: 'UserAdmin',
        scope: ['test', 'user']
      },
      'iBlog2JsonWebTokenSecretKey123'
    )

    res.json({
      token: {
        accessToken
      }
    })
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/logout", (req, res, next) => {
  res.json({
    code: 1
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

export default {
  path: "/auth/api",
  handler: app
};
