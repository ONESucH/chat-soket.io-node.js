'use strict';
$(() => {
    const socket = io();

    $('form').submit(function (e) {
        if ($('#input').val() === '') return false;
        
        e.preventDefault();
        
        socket.emit('chat message', $('#input').val());
        $('#input').val('');
        return false;
    });
    
    socket.on('chat message', function(msg){
       console.log(msg);
       $('.chat-text').prepend('<li>'+ msg +'</li>');
    });
    
    socket.on('connection', function(data) {
        socket.emit('chat message', data);
    });
});
