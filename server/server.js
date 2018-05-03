#!/usr/bin/env mongo
'use strict';

const express = require('express'),
    nunjucks = require('nunjucks'), // библиотека шаблонов на js
    app = express(),
    server = require('http').Server(app),
    logger = require('morgan'),
    bodyParser = require('body-parser'), // json parser
    io = require('socket.io')(server, {serveClient: true}), // serveClient(option) - будет ли храниться socket.io на клиенте
    mongoose = require('mongoose'),
    MongoClient = require('mongodb').MongoClient,
    chat = require('../server/routers/Chat-rouser-user'); // модель запросов

/* mongouse - подключает библиотеку для связи с mongoDB */
mongoose.Promise = require('bluebird'); // bluebird библиотека для промисов
mongoose.connect('mongodb://localhost/chat', {promiseLibrary: require('bluebird')})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

/* Библиотека Nunjucks */
nunjucks.configure('./client', { // конфигурация для nunjucks
    autoescape: true,
    express: app,
    watch: true
});

/* Сессии */
app.get('/', (req, res) => { // / - енпойнт
    res.render('index.html', {
        date: new Date()
    });
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': 'false'}));
app.use('/client', express.static('./client')); // енпойнт/url
app.use('/clients', chat); // енпойнт/url

require('./sockets')(io); // передаем io в экспортируемый файл

/* 404 */
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* error handler */
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(3000, () => {
    console.log('Server success on port 3000');
});