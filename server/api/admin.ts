import express from "express";
import proxy  from "../proxy/admin";
import { IResp } from "../types";

const router = express.Router();
router.get('/categories', async (req, res, next) => {
  let resp: IResp;
  try {
      const categories = await proxy.getCategories();
      resp = {
          code: 1,
          data: categories
      }
  } catch (err) {
      console.error(err);
      resp = {
          code: -1,
      }
  }
  res.json(resp);
});

router.get("/posts", async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.getPosts(req.query);
    resp = {
      code: 1,
      data
    };
  } catch (err) {
    console.error(err);
    resp = {
      code: -1,
      message: err.message
    };
  }
  res.json(resp);
});

export default router;
