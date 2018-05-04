#!/usr/bin/env mongo
'use strict';

const express = require('express'),
    nunjucks = require('nunjucks'), // библиотека шаблонов на js
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server, {serveClient: true}), // serveClient(option) - будет ли храниться socket.io на клиенте
    mongoose = require('mongoose'),
    MongoClient = require('mongodb').MongoClient,
    logger = require('morgan'),
    bodyParser = require('body-parser'), // json parser
    passport = require('passport'), // регистрация
    cookieParser = require('cookie-parser'), // регистрация
    JwtStrategy = require('passport-jwt').Strategy, // регистрация
    { jwt } = require('./config'); // Регистрация, токен

/* Проверяем регистрацию */
passport.use(new JwtStrategy(jwt, (jwt_payload, done) => {
    // Проверяем данные пользователя по токену
    if (jwt_payload !== void(0)) return done(false, jwt_payload);
    console.log('jwt_payload', jwt_payload);
    done();
}));

/* mongouse - подключает библиотеку для связи с mongoDB */
mongoose.Promise = require('bluebird'); // bluebird библиотека для промисов
mongoose.connect('mongodb://localhost/chat', {promiseLibrary: require('bluebird')})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));
mongoose.set('debug', true);

/* Библиотека Nunjucks */
nunjucks.configure('./client', { // конфигурация для nunjucks
    autoescape: true,
    express: app,
    watch: true
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': 'false'}));
app.use(cookieParser());

require('./router')(app); // импортируем в файл app
require('./sockets')(io); // импортируем в файл io
require('../client/js/unauth')(MongoClient); // импортируем в файл io

/* 404 */
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* error handler */
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

/* Запуск сервера по порту: */
server.listen(3000, () => {
    console.log('Server success on port 3000');
});