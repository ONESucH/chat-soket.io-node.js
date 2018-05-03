/* Sockets  */
const UserModel = require('./models/Chat-model-user'); // model

module.exports = io => {
    io.on('connection', (socket) => {

        console.log('user connected');
        socket.join('main-table'); // Выбрали стол

        // отключенные пользователи
        socket.on('disconnect', () => {
            console.log('user disconnected'); // User - вышел
        });
        
        // сообщения в чате
        socket.on('chat message', (msg) => {
            const user = {
                date: new Date(),
                content: msg,
                user_id: socket.id
            };

            UserModel.create(user, err => {
               if (err) return console.error('UserModel', UserModel);
                io.emit('chat message', msg);
                socket.to('main-table').emit('chat message', msg); // Отправляем сообщение внутри стола "main-table"
            });
        });
        
        socket.on('receiveHistory', () => {
            UserModel
                .find({}) // поиск
                .sort({date: -1}) // сортировка по убыванию
                .limit(30) // лимит на получение объектов
                .lean() // Убирает все Mongoose зависимости
                .exec((err, message) => { // Возращает объекты без приявзки Mongoose
                    if (!err) {
                        io.emit('history', message);
                        /*socket.to('main-table').emit('history', message);*/
                    }
                })
        })

    });
};