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

router.get('/article', async (req, res, next) => {
  let resp: IResp;
  try {
      const article = await proxy.getArticle(req.query.uid);
      resp = {
          code: 1,
          data: article
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

// 新增文章
router.post('/article', async (req, res) => {
  let resp: IResp;
  try {
    const article = await proxy.newArticle(req.body);
    resp = {
      code: 1,
      data: article
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

// 修改文章
router.put('/article', async (req, res) => {
  let resp: IResp;
  try {
    const article = await proxy.editArticle(req.query.uid, req.body);
    resp = {
      code: 1,
      data: article
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

// 删除文章
router.delete('/article', async (req, res) => {
  let resp: IResp;
  try {
    let data;
    if (req.query.force) {
      // 永久删除，不可恢复
      data = await proxy.delete2Article(req.query.uids);
    } else {
      // 临时删除，可恢复
      data = await proxy.deleteArticle(req.query.uids);
    }
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

// 检查文章alias是否重复
router.get('/checkArticleAlias', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.checkArticleAlias(req.query);
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

// 检查分类alias是否重复
router.get('/checkCategoryAlias', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.checkCategoryAlias(req.query);
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

// 新增分类
router.post('/category', async (req, res) => {
  let resp: IResp;
  try {
    const category = await proxy.newCategory(req.body);
    resp = {
      code: 1,
      data: category
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

// 修改分类
router.put('/category', async (req, res) => {
  let resp: IResp;
  try {
    const category = await proxy.editCategory(req.query.uid, req.body);
    resp = {
      code: 1,
      data: category
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

// 删除文章
router.delete('/category', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.deleteCategory(req.query.uids);
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

router.get("/comments", async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.getComments(req.query);
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

// 删除评论
router.delete('/comment', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.deleteComment(req.query.uids);
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

router.get("/guestbook", async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.getGuestbook(req.query);
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

// 删除留言
router.delete('/guestbook', async (req, res) => {
  let resp: IResp;
  try {
    const data = await proxy.deleteGuestbook(req.query.uids);
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
