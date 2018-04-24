'use strict';
$(() => {

    const socket = io();
    
    $('form').submit(function (e) {
        e.preventDefault();
        socket.emit('chat message', $('#input').val());
        $('#input').val('');
        return false;
    });

    socket.on('connection', function(socket){
        socket.on('chat message', function(msg){
            console.log('message: ' + msg);
        });
    });
});
