'use strict';
$(() => {
    /* Собираем данные и выводим во frontend */
    const socket = io();
    let menuRight = false;

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
    /* --------------------------------------- */
    
    
    /* Открыть/Скрыть чат */
    $('.show-hide-button').on('click', () => {
        if (!menuRight) { // закрыли
            $('.chat').fadeIn('slow');
            $('.show-hide-button i').attr('class','fa fa-angle-right');
            menuRight = true;
        } else {
            $('.chat').fadeOut('slow');
            $('.show-hide-button i').attr('class','fa fa-angle-left');
            menuRight = false;
        }
    })
});

