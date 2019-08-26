const categoryProxy = require('./proxy/category');
const postProxy = require('./proxy/post');
const guestbookProxy = require('./proxy/guestbook');
const express = require('express');
const router = express.Router();

router.get('/categories', async (req, res, next) => {
    try {
        const categories = await categoryProxy.getCategories(true);
        res.json({
            code: '1',
            data: categories
        });
    } catch (err) {
        res.json({
            code: '-1'
        });
    }
});

router.get('/posts', async (req, res, next) => {
    try {
        const data = await postProxy.getPosts(req.query);
        res.json({
            code: '1',
            data
        });
    } catch (err) {
        res.json({
            code: '-1'
        });
    }
});

router.get('/article', async (req, res, next) => {
    try {
        const data = await postProxy.getArticle(req.query);
        res.json({
            code: '1',
            data
        });
    } catch (err) {
        res.json({
            code: '-1'
        });
    }

});

router.get('/guestbook', async (req, res, next) => {
    try {
        const data = await guestbookProxy.getGuestbook(req.query);
        res.json({
            code: '1',
            data
        });
    } catch (err) {
        res.json({
            code: '-1'
        });
    }
});

router.post('/saveComment', async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.json({
            code: '-2'
        });
    }
    try {
        await postProxy.saveComment(req.body, user);
        res.json({
            code: '1'
        });
    } catch (err) {
        console.error(err);
        res.json({
            code: '-1'
        });
    }
});

router.post('/saveGuestbook', async (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.json({
            code: '-2'
        });
    }
    try {
        await guestbookProxy.saveGuestbook(req.body, user);
        res.json({
            code: '1'
        });
    } catch (err) {
        console.error(err);
        res.json({
            code: '-1'
        });
    }

});

module.exports = router;
