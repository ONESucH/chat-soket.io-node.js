'use strict';

const socket = io();

/* Добавляем новове сообщение в лит сообщений */
function postMessage() {
    socket.emit('chat message', () => {
        console.log('.chat-text', $('.chat-text'));
        $('.chat-text').html('<li>'+ $('#input').val() +'</li>');
    });
    $('#input').val('');
}