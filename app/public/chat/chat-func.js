
$(function(){
    $('#chat-start-button').click(function(){
        startchat();
    });
    $('#dashboard-start-button').click(function(){
        startchat();
    });
    $('#start-chat-frommenu').click(function(){
        var plate = $('#theplate').val();
        window.location.href = 'https://chromemufflerbearing.com/c/message' + plate;
    });
    $('#open-chat-menu').click(function(){
       
            $('#customer-chat-window').css('display', 'inherit');
            animateCSS('#customer-chat-window', 'slideInUp', function() {

            });
    });
    $('#chat-window-close').click(function(){
            animateCSS('#customer-chat-window', 'slideOutDown', function() {
                $('#customer-chat-window').css('display', 'none');
            });
    });
    $('#send-chat-text').click(function(){
        savechatmessages();
    });

    $('#chat-name').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            event.preventDefault();
            $('#chat-phone').focus();
        }
    });

    $('#chat-phone').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            event.preventDefault();
            startchat();
        }
    });



    $('#chat-text-tosend').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            event.preventDefault();
            savechatmessages();
        }
    }); 

});






var startchatcode = 0;
function startchat() { 
//chat popup
    var status = 0;
    var theplate = $('#chat-phone').val();
    var thename = $('#chat-name').val();
    var n = thename.length;
    var p = theplate.length;
    if (n == 0 || p == 0) {
        $('#blank-info').css('display', 'inherit');
        animateCSS('#blank-info', 'slideInUp', function() {

        });
        return;
    } else {
            $('#chat-main').css('display', 'inherit');
            animateCSS('#chat-main', 'slideInUp', function() {
                $('#chat-setup').css('display', 'none');
                $('.chat-window-textbox').css('display', 'grid');
                $('#chat-text-tosend').focus();
            });

            var platein = $('#chat-phone').val();
            var plate = platein.replace(" ", "");
            plate = plate.replace("-", "");
            plate = plate.toLowerCase();
            plate = plate.replace("-", "");
            var numberPattern = /\d+/g;
            plate = plate.match(numberPattern);
            $('#theplate').val(plate);
            $.ajax({
                    url: "//chromemufflerbearing.com/save/plate",
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    data: {
                        plate: plate
                    }
            })
            .done(function( data ) {
                saveinfo();

            })
            .fail(function( xhr, status, errorThrown ) {
                if (status === 0) {

                }
            })
            .always(function( xhr, status ) {
                
            });
    } 

    


};


function saveinfo() {    
var theymme = '';
var chatplate = $('#theplate').val();
var name = $('#chat-name').val();
$('#username').val(name);
status = 10;
                $.ajax({
                        type: "POST",
                        url: "https://chromemufflerbearing.com/edit/contact/info",
                        data: {
                            plate: chatplate,
                            name: name,
                            phone: chatplate
                        }
                    })
                    .done(function( data ) {
                        startchatcode = 1;
                       loadchatmessages();
                    
                    })
                    .fail(function( xhr, status, errorThrown ) {
                        if (startchatcode === 0) {
                           startchat();
                        }
                    })
                    .always(function( xhr, status ) {
                    });
}

var loadchatmessagescode = 0;
function loadchatmessages() {
var howtofix = '';
var plate = $('#theplate').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/message/",
        data: {
            plate: plate
        }
    })
    .done(function( data ) {
        loadchatmessagescode = 1;
        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        var timestamp = 0;
        $('#chat_thread').html('</br>');

        for (var i = 0; i < jsonData.length; ++i) {
            $('#chat_thread').append('<h3><span class="headline-highlight-color">'+jsonData[i].sentby+':</span> '+jsonData[i].message+'</h3>');
        }
        if (jsonData.length == 0) {
            $('#chat_thread').append('<h3><span class="headline-highlight-color">Auto Response:</span> Hello! We usually respond within {an hour} during business hours. If you prefer an email alert when we respond type \'email alert on\' without quotes, or type \'text alert on\' to get text alerts. Otherwise this conversation is saved under your phone number, check back for a response. </h3>');
        }
        setTimeout(loadchatmessages, 120000);
        

    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadchatmessagescode === 0) {
            loadchatmessages();
        }
    })
    .always(function( xhr, status ) {

    });
};

var isWaitingOnEmail = 0;
var savechatmessagescode = 0;
function savechatmessages() {

var howtofix = '';
var plate = $('#theplate').val();
var chatmessage = $('#chat-text-tosend').val();
var username = $('#username').val();
var datetimenow = moment().format('hh:mm a MM.DD.YYYY');
    var n = chatmessage.length;
    if (n == 0) {
            
        return;
    } else {
        $('#chat_thread').append('<h3><span class="headline-highlight-color">'+username+':</span> '+chatmessage+'</h3>');
        

        $.ajax({
            type: "POST",
            url: "https://chromemufflerbearing.com/save/chat/message/",
            data: {
                plate: plate,
                thechatmessage: chatmessage,
                sentby: username,
                nicetime: datetimenow
            }
        })
        .done(function( data ) {
            $('#chat-text-tosend').val('');
            savechatmessagescode = 1;
            var jsonStr = JSON.stringify(data);
            var jsonData = JSON.parse(jsonStr);
            var timestamp = 0;
            for (var i = 0; i < jsonData.length; ++i) {

            }
            $('.customer-chat-window').animate({ scrollTop: 0 }, 2000);
            document.querySelector('.bottom').scrollIntoView({
                behavior: 'smooth' 
            });

            if (chatmessage === 'email alert on') {
                setTimeout(function(){
                    $('#chat_thread').append('<h3><span class="headline-highlight-color">Auto Response:</span> Enter Your Email Address please</h3>');
                    document.querySelector('.bottom').scrollIntoView({
                        behavior: 'smooth' 
                    });
                    isWaitingOnEmail = 1;
                }, 1000);
                return;
            }
            if (isWaitingOnEmail === 1) {
                setTimeout(function(){
                    $('#chat_thread').append('<h3><span class="headline-highlight-color">Auto Response:</span> We have your Email as: ' + chatmessage + ' you can say email alert off to turn email alerts off </h3>');
                    document.querySelector('.bottom').scrollIntoView({
                        behavior: 'smooth' 
                    });
                    isWaitingOnEmail = 0;
                }, 1000);
            }
            if (chatmessage === 'email alert off') {
                setTimeout(function(){
                    $('#chat_thread').append('<h3><span class="headline-highlight-color">Auto Response:</span> Email Alerts are OFF</h3>');
                    document.querySelector('.bottom').scrollIntoView({
                        behavior: 'smooth' 
                    });
                }, 1000);
            }
            if (chatmessage === 'text alert on') {
                setTimeout(function(){
                    $('#chat_thread').append('<h3><span class="headline-highlight-color">Auto Response:</span> Text Alerts are ON</h3>');
                    document.querySelector('.bottom').scrollIntoView({
                        behavior: 'smooth' 
                    });
                

                }, 1000);
            }
            if (chatmessage === 'text alert off') {
                setTimeout(function(){ 
                    $('#chat_thread').append('<h3><span class="headline-highlight-color">Auto Response:</span> Text Alerts are OFF</h3>');
                    document.querySelector('.bottom').scrollIntoView({
                        behavior: 'smooth' 
                    });
                }, 1000);
            }
            if (chatmessage === 'repair dash') {
                setTimeout(function(){ 
                    $('#chat_thread').append('<h3><span class="headline-highlight-color">Auto Response:</span> <a href="https://chromemufflerbearing.com/c/home/'+plate+'"><h2 class="big-button">Repair Dashboard</h2></a></h3>');
                    document.querySelector('.bottom').scrollIntoView({
                        behavior: 'smooth' 
                    });
                }, 1000);
            }

            if (chatmessage === 'schedule') {
                setTimeout(function(){ 
                    $('#chat_thread').append('<h3><span class="headline-highlight-color">Auto Response:</span> <a href="https://chromemufflerbearing.com/c/home/'+plate+'"><h2 class="big-button">Schedule</h2></a></h3>');
                    document.querySelector('.bottom').scrollIntoView({
                        behavior: 'smooth' 
                    });
                }, 1000);
            }
            if(chatmessage === '/botlist') {
                $('#chat_thread').append('<div class="colorprimary"><div class="two-col-grid"><div class="two-col-border"><h1>Chat Bot:</h1></div><div class="two-col-border"><h4>Commands are /hours /map /address /phone /rate </h4></div></div></div>');
                document.querySelector('#chat-main').scrollIntoView({
                    behavior: 'smooth' 
                });
            }
            if(chatmessage === '/hours') {
                $('#chat_thread').append('<div class="colorprimary"><div class="two-col-grid"><div class="two-col-border"><h1>Chat Bot:</h1></div><div class="two-col-border"><h4>Our hours are</h4></div></div></div>');
                document.querySelector('.bottom').scrollIntoView({
                    behavior: 'smooth' 
                });
            }
            if(chatmessage === '/map') {
                $('#chat_thread').append('<div class="colorprimary"><div class="two-col-grid"><div class="two-col-border"><h1>Chat Bot:</h1></div><div class="two-col-border"><h4>Our map link</h4></div></div></div>');
                document.querySelector('.bottom').scrollIntoView({
                    behavior: 'smooth' 
                });
            }
            if(chatmessage === '/address') {
                $('#chat_thread').append('<div class="colorprimary"><div class="two-col-grid"><div class="two-col-border"><h1>Chat Bot:</h1></div><div class="two-col-border"><h4>Our address is</h4></div></div></div>');
                document.querySelector('.bottom').scrollIntoView({
                    behavior: 'smooth' 
                });
            }
            if(chatmessage === '/phone') {
                $('#chat_thread').append('<div class="colorprimary"><div class="two-col-grid"><div class="two-col-border"><h1>Chat Bot:</h1></div><div class="two-col-border"><h4>Our phone number is</h4></div></div></div>');
                document.querySelector('.bottom').scrollIntoView({
                    behavior: 'smooth' 
                });
            }
            if(chatmessage === '/rate') {
                $('#chat_thread').append('<div class="colorprimary"><div class="two-col-grid"><div class="two-col-border"><h1>Chat Bot:</h1></div><div class="two-col-border"><h4>Our hourly rate is</h4></div></div></div>');
                document.querySelector('.bottom').scrollIntoView({
                    behavior: 'smooth' 
                });
            }


        })
        .fail(function( xhr, status, errorThrown ) {
            if (savechatmessagescode === 0) {
                
            }
        })
        .always(function( xhr, status ) {

        });
    }
};

