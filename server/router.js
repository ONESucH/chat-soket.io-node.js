'use strict';
const express = require('express'),
    chat = require('../server/routers/Chat-rouser-user'), // модель запросов
    UserModel = require('./models/Chat-model-user'),
    passport = require('passport'),
    _ = require('lodash'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    config = require('./config');

/* Проверяем Аутентификацию */
function getAuth(req, res, next) {
    console.log('Проверяем аутентификацию');
    passport.authenticate('jwt', {session: false}, (err, decryptToken, jwtErr) => { // err/token/err-jwt
        if (jwtErr !== void(0) || err !== void(0)) return res.render('index.html', {error: err || jwtErr});
        req.user = decryptToken;
        next();
    })(req, res, next);
}

function createToken(body) {
    return jwt.sign(
        body,
        config.jwt.secretOrKey,
        {expiresIn: config.expiresIn}
    )
}

module.exports = app => {
    app.use('/client', express.static('./client')); // енпойнт/url
    app.use('/clients', chat); // енпойнт/url
    
    app.get('/', getAuth, (req, res) => { // / - енпойнт
        res.render('index.html', {date: new Date()});
    });
    
    app.post('/login', async (req, res) => {
        try {
            let user = await UserModel.findOne({username: {$regex: _.escapeRegExp(req.body.username), $options: 'i'}}).lean().exec();
            if (user !== void(0) && bcrypt.compareSync(req.body.password, user.password)) {
                const token = createToken({id: user._id, username: user.username});
                res.cookie('token', token,  {
                    httpOnly: true
                });
                res.status(200).send({message: 'User login success'})
            } else {
                res.status(400).send({message: 'User not exist password'});
            }
            
        } catch (e) {
            console.log('error, login', e);
            res.status(500).send({message: 'login errror'})
        }
    });
    app.post('/register', async (req, res) => {
        try {
            let user = await UserModel.findOne({username: {$regex: _.escapeRegExp(req.body.username), $options: 'i'}}).lean().exec();
            
            if (user !== void(0)) return res.status(400).sendDate({message: 'User already exist'});
            
            user = await UserModel.create({
                username: req.body.username,
                password: req.body.password,
            });
            
            const token = createToken({id: userCreate._id, username: userCreate.name});
            res.cookie('token', token, {
                httpOnly: true
            });
            
            res.status(200).send({message: "User create"})
        } catch (e) {
            console.log('e , register ', e);
            res.status(500).send({message: 'error'})
        }
    });
    
    app.post('logout', (req, res) => {
        res.clearCookie('token');
        res.status(200).send({message: 'Logout success'});
    })
};