'use strict';
let menuRight = false;

$(document).ready(() => {
    /* Собираем данные и выводим во frontend */
    let socket = io();
    
    $.ajax({
        url: '/clients',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            if (data.length !== '') {
                console.log('data', data);
                console.log('data.email', data[0].email);
            } 
        },
        error: (err) => {
            console.log('err', err);
            window.location.href = '';
            return false;
        }
    });

    $('form').submit(function (e) {
        let inputData = $('#input');

        if (inputData.val() === '') return false;

        e.preventDefault();

        socket.emit('chat message', inputData.val());
        inputData.val('');
        return false;
    });

    socket.on('chat message', (msg) => {
        /*console.log(msg);*/
        $('.chat-text').prepend('<li>' + msg + '</li>');
    });
    /* --------------------------------------- */
});


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