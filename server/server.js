'use strict';
const express = require('express'),
    nunjucks = require('nunjucks'), // библиотека работающая на js с html
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server), // serveClient(option) - будет ли храниться socket.io на клиенте
    mongoose = require('mongoose');

/**
 *  mongouse - подключаем библиотеку для связи с mongoDB
 */
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/chat', {promiseLibrary: require('bluebird')})
    .then(function () {
        console.log('MongoDb connected');
    })
    .catch(function (err) {
    console.error(err);
});
/* Библиотека Nunjucks */
nunjucks.configure('./client', { // конфигурация для nunjucks
    autoescape: true,
    express: app,
    watch: true
});
/* ------------------- */

// /client - енпойнт для поиска путей(не должны сопадать) пример src="/client/img/*.png"
app.use('/client', express.static('./client')); // енпойнт/url

app.get('/', (req, res) => { // / - енпойнт
    res.render('index.html', {date: new Date()});
});

/* Sockets  */
io.on('connection', function(socket){
    console.log('user connected');
    console.log('socket', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});
/* -------- */

server.listen(3000, () => {
    console.log('Server success on port 3000');
});