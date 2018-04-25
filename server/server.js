'use strict';
const express = require('express'),
    nunjucks = require('nunjucks'), // библиотека работающая на js с html
    app = express(),
    server = require('http').Server(app),
    logger = require('morgan'),
    bodyParser = require('body-parser'), // json parser
    io = require('socket.io')(server, {serveClient: true}), // serveClient(option) - будет ли храниться socket.io на клиенте
    mongoose = require('mongoose'),
    chat = require('../client/routers/Chat-rouser-user'); // модель запросов

/**
 *  mongouse - подключаем библиотеку для связи с mongoDB
 **/
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/chat', {promiseLibrary: require('bluebird')})
    .then(() => console.log('MongoDb connected'))
    .catch((err) => console.error(err));

/* Библиотека Nunjucks */
nunjucks.configure('./client', { // конфигурация для nunjucks
    autoescape: true,
    express: app,
    watch: true
});

app.get('/', (req, res) => { // / - енпойнт
    res.render('index.html', {date: new Date()});
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': 'false'}));
// енпойнтs 
app.use('/client', express.static('./client')); // енпойнт/url
app.use('/clients', chat); // енпойнт/url

/* Sockets  */
io.on('connection', (socket) => {
    console.log('user connected');
    //console.log('socket', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});
/* -------- */

// 404
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
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