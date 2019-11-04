import express from "express";
import proxy from "../proxy/index";
import { IResp } from "../types";

const router = express.Router();
router.get('/categories', async (req, res, next) => {
    let resp: IResp;
    try {
        const categories = await proxy.getCategories(true);
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

router.get('/guestbook', async (req, res, next) => {
    let resp: IResp;
    try {
        const data = await proxy.getGuestbook();
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

router.post('/saveComment', async (req, res, next) => {
    let resp: IResp;
    const user = req.user;
    if (!user) {
        resp = {
            code: -2
        }
        return res.json(resp);
    }
    try {
        await proxy.saveComment(req.body, user);
        resp = {
            code: 1
        }
    } catch (err) {
        console.error(err);
        resp = {
            code: -1
        }
    }
    res.json(resp);
});

router.post('/saveGuestbook', async (req, res, next) => {
    let resp: IResp;
    const user = req.user;
    if (!user) {
        resp = {
            code: -2
        }
        return res.json(resp);
    }
    try {
        await proxy.saveGuestbook(req.body, user);
        resp = {
            code: 1
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
