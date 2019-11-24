import express from "express";
import proxy from "../proxy/index";
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

router.get('/posts', async (req, res, next) => {
    let resp: IResp;
    try {
        const data = await proxy.getPosts(req.query);
        resp = {
            code: 1,
            data
        }
    } catch (err) {
        console.error(err);
        resp = {
            code: -1,
        }
    }
    res.json(resp);
});

router.get('/popArticles', async (req, res, next) => {
    let resp: IResp;
    try {
        const data = await proxy.getPopArticles();
        resp = {
            code: 1,
            data
        }
    } catch (err) {
        console.error(err);
        resp = {
            code: -1,
        }
    }
    res.json(resp);
});

router.get('/popLabels', async (req, res, next) => {
    let resp: IResp;
    try {
        const data = await proxy.getPopLabels();
        resp = {
            code: 1,
            data
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
        const data = await proxy.getArticle(req.query);
        resp = {
            code: 1,
            data
        }
    } catch (err) {
        console.error(err);
        resp = {
            code: -1,
        }
    }
    res.json(resp);
});

router.get('/comments', async (req, res, next) => {
    let resp: IResp;
    try {
        const data = await proxy.getComments(req.query);
        resp = {
            code: 1,
            data
        }
    } catch (err) {
        console.error(err);
        resp = {
            code: -1,
        }
    }
    res.json(resp);
});

router.post('/comment', async (req, res, next) => {
    let resp: IResp;
    // const user = req.user;
    // if (!user) {
    //     resp = {
    //         code: -2
    //     }
    //     return res.json(resp);
    // }
    try {
        const article = await proxy.saveComment(req.body);
        resp = {
            code: 1,
            data: article
        }
    } catch (err) {
        console.error(err);
        resp = {
            code: -1
        }
    }
    res.json(resp);
});

router.get('/guestbook', async (req, res, next) => {
    let resp: IResp;
    try {
        const data = await proxy.getGuestbook(req.query);
        resp = {
            code: 1,
            data
        }
    } catch (err) {
        console.error(err);
        resp = {
            code: -1,
        }
    }
    res.json(resp);
});

router.post('/guestbook', async (req, res, next) => {
    let resp: IResp;
    // const user = req.user;
    // if (!user) {
    //     resp = {
    //         code: -2
    //     }
    //     return res.json(resp);
    // }
    try {
        const guestbookItem = await proxy.saveGuestbook(req.body);
        resp = {
            code: 1,
            data: guestbookItem
        }
    } catch (err) {
        console.error(err);
        resp = {
            code: -1
        }
    }
    res.json(resp);
});

router.get('/settings', async (req, res, next) => {
    let resp: IResp;
    try {
        const settings = await proxy.getSettings();
        resp = {
            code: 1,
            data: settings
        }
    } catch (err) {
        console.error(err);
        resp = {
            code: -1
        }
    }
    res.json(resp);
});

export default router;
