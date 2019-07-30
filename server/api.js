const categoryProxy = require('./proxy/category');
const postProxy = require('./proxy/post');
const express = require('express');
const router = express.Router();

router.get('/categories', async (req, res, next) => {
    const categories = await categoryProxy.getCategories(true);
    res.json({
        code: '1',
        data: categories
    });
});

router.get('/posts', async (req, res, next) => {
    const data = await postProxy.getPosts(req.query);
    res.json({
        code: '1',
        data
    });
});

router.get('/article', async (req, res, next) => {
    const data = await postProxy.getArticle(req.query);
    res.json({
        code: '1',
        data
    });
});

module.exports = router;
