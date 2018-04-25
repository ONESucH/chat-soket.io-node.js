'use strict';
$(() => {
    /* Собираем данные и выводим во frontend */
    const socket = io();
    let menuRight = false;
    
    $('form').submit(function (e) {
        let inputData = $('#input');
        
        if (inputData.val() === '') return false;
        
        e.preventDefault();
        
        socket.emit('chat message', inputData.val());
        inputData.val('');
        return false;
    });
    
    socket.on('chat message', (msg)=> {
       /*console.log(msg);*/
       $('.chat-text').prepend('<li>'+ msg +'</li>');
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

