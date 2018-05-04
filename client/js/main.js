'use strict';
let menuRight = false;

$(document).ready(() => {
    /* Собираем данные и выводим */
    let socket = io();

    $('form').on('submit', function (e) {
        e.preventDefault();
        
        let messageChat = $('#message-chat');

        if (messageChat.val() === '') return false;

        socket.emit('chat message', messageChat.val());
        messageChat.val('');
    });

    socket.on('chat message', (msg) => {
        /*console.log(msg);*/
        $('.chat-text').prepend('<li>' + msg + '</li>');
    });
    /* --------------------------------------- */

    /* Открыть/Скрыть чат */
    $('.show-hide-button').on('click', () => {
        if (!menuRight) {
            $('.chat').fadeIn('slow');
            $('.show-hide-button i').attr('class', 'fa fa-angle-right');
            menuRight = true;
        } else {
            $('.chat').fadeOut('slow');
            $('.show-hide-button i').attr('class', 'fa fa-angle-left');
            menuRight = false;
        }
    });
    /* --------------------------------------- */
});