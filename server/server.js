'use strict';
const express = require('express'),
    app = express(),
    nunjucks = require('nunjucks'), // библиотека работающая на js с html
    server = require('http').Server(app),
    io = require('socket.io')(server, { serveClient: true }); // serveClient(option) - будет ли храниться socket.io на клиенте

/* Библиотека Nunjucks */
nunjucks.configure('./client', { // конфигурация для nunjucks
    autoescape: true,
    express: app,
    watch: true
});
/* ------------------- */

app.use('/client', express.static('./client')); // /client - енпойнт для поиска путей(не должны сопадать) пример src="/client/img/*.png"

app.get('/', (req, res) => { // / - енпойнт
    res.render('index.html', {date: new Date()});
});

/* Sockets  */
io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('disconnect', () => {
        console.log('user disconnect');
    });
});
/* -------- */

server.listen(3000, () => {
    console.log('Server success on port 3000');
});