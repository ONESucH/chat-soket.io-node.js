let app = require('http').createServer(handler),
    io = require('socket.io')(app),
    fs = require('fs'),
    path = require('path'),
    port = 3000;

function handler(req, res) {
    // чтение файлов idnex.html
    fs.readFile(path.join(__dirname, '/src/index.html'),
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    })
}

io.on('connection', function (socket) { // socket интерфейс для обращения клиента и сервера
    socket.emit('news', {greeting: 'Hello World'}); // генирируем события(news) с данными greeting
    socket.on('greeting', function (data) { // на событие greeting устанавливаем функцию которая принемает данные
        console.log('data', data); // выводим данные
    });
});

app.listen(port, function () {
   console.log('app runing on port' + port); 
});