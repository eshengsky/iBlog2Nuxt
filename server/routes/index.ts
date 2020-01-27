import { Router } from 'express';
import jwt from 'express-jwt';
import * as proxy from '../proxy/index';
import { IResp } from '../../types';
import config from '../../blog.config';

const router = Router();

// JWT middleware
router.use(
    jwt({
        secret: config.jwtSecret,
        credentialsRequired: false
    })
);

router.get('/categories', async (_req, res) => {
    let resp: IResp;
    try {
        const categories = await proxy.getCategories();
        resp = {
            code: 1,
            data: categories
        };
    } catch (err) {
        console.error(111, err);
        resp = {
            code: -1,
            message: err.message
        };
    }
    res.json(resp);
});

router.get('/posts', async (req, res) => {
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
            code: -1
        };
    }
    res.json(resp);
});

router.get('/popArticles', async (_req, res) => {
    let resp: IResp;
    try {
        const data = await proxy.getPopArticles();
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

router.get('/popLabels', async (_req, res) => {
    let resp: IResp;
    try {
        const data = await proxy.getPopLabels();
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

router.get('/article', async (req, res) => {
    let resp: IResp;
    try {
        const data = await proxy.getArticle(req.query);
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

router.get('/postsCountByCate', async (req, res) => {
    let resp: IResp;
    try {
        const data = await proxy.getPostsCountByCate(req.query.category);
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

// 文章浏览数+1
router.put('/increaseViews', async (req, res) => {
    let resp: IResp;
    try {
        const clientIP = req.ip;
        await proxy.increaseViews({
            postID: req.body.postID,
            clientIP
        });
        resp = {
            code: 1
        };
    } catch (err) {
        console.error(err);
        resp = {
            code: -1
        };
    }
    res.json(resp);
});

router.get('/comments', async (req, res) => {
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
            code: -1
        };
    }
    res.json(resp);
});

router.post('/comment', async (req, res) => {
    let resp: IResp;
    if (/^admin$/i.test(req.body.username) && !(req as any).user) {
        resp = {
            code: -1,
            message: '非法昵称！'
        };
        return res.json(resp);
    }
    try {
        const article = await proxy.saveComment(req.body);
        resp = {
            code: 1,
            data: article
        };
    } catch (err) {
        console.error(err);
        resp = {
            code: -1
        };
    }
    res.json(resp);
});

router.get('/guestbook', async (req, res) => {
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
            code: -1
        };
    }
    res.json(resp);
});

router.post('/guestbook', async (req, res) => {
    let resp: IResp;
    if (/^admin$/i.test(req.body.username) && !(req as any).user) {
        resp = {
            code: -1,
            message: '非法昵称！'
        };
        return res.json(resp);
    }
    try {
        const guestbookItem = await proxy.saveGuestbook(req.body);
        resp = {
            code: 1,
            data: guestbookItem
        };
    } catch (err) {
        console.error(err);
        resp = {
            code: -1
        };
    }
    res.json(resp);
});

router.get('/settings', async (_req, res) => {
    let resp: IResp;
    try {
        const settings = await proxy.getSettings();
        resp = {
            code: 1,
            data: settings
        };
    } catch (err) {
        console.error(err);
        resp = {
            code: -1
        };
    }
    res.json(resp);
});

router.get('/profile', async (_req, res) => {
    let resp: IResp;
    try {
        const profile = await proxy.getProfile();
        resp = {
            code: 1,
            data: profile
        };
    } catch (err) {
        console.error(err);
        resp = {
            code: -1
        };
    }
    res.json(resp);
});

export default router;
