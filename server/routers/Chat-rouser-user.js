const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Users = require('../models/Chat-model-user');

router.get('/', (req, res, next) => {
    Users.find((err, products) => {
        if (err) return next(err);
        res.json(products);
    });
});

router.get('/:id', (req, res, next) => {
    Users.findById(req.params.id, (err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

router.post('/', (req, res, next) => {
    Users.create(req.body, (err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

router.put('/:id', (req, res, next) => {
    Users.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

router.delete('/:id', (req, res, next) => {
    Users.findByIdAndRemove(req.params.id, req.body, (err, post) => {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;