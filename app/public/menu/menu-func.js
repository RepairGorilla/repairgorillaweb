$(function(){
    loadbloglist();
    $('#menu-pricing').click(function(){
        window.location.href = "https://chromemufflerbearing.com/pricing"
    });
    $('#menu-how-it-works').click(function(){
        window.location.href = "https://chromemufflerbearing.com/how-it-works"
    });
    $('#menu-features').click(function(){
        window.location.href = "https://chromemufflerbearing.com/features"
    });
    $('#menu-about').click(function() {
        window.location.href = "https://chromemufflerbearing.com/about"
    });

    $('#menu-home').click(function(){
        window.location.href = "https://chromemufflerbearing.com/"
    });

    $('#map').css('display', 'none');
    $('#hide-map').css('display', 'none');
    $('#schedule-repair-button').click(function(){
        $('#get_started_menu').css('display', 'none');
        $('#hide-get-started-menu').css('display', 'none');

        $('#get_started_schedule_menu').css('display', 'inherit');
        $('#hide-schedule-menu').css('display', 'inherit');

    });
    $('#show-start-schedule').click(function(){
        $('#get_started_menu').css('display', 'none');
        $('#hide-get-started-menu').css('display', 'none');

        $('#get_started_schedule_menu').css('display', 'inherit');
        $('#hide-schedule-menu').css('display', 'inherit');
    });
    $('#hide-schedule-menu').click(function(){
        $('#everything-else').css('display', 'inherit');
        $('#get_started_schedule_menu').css('display', 'none');
        $('#hide-schedule-menu').css('display', 'none');
        animateCSS('#everything-else', 'bounceInRight', function() {
            
        });
    });
    click1('cmb', 'load', 'https://chromemufflerbearing.com');


    $('#show-start-chat').click(function(){
        $('#get-started-chat').css('display', 'inherit');
        $('#get-started-option-list').css('display', 'none');
    });

    $('#hide-get-started-menu').click(function(){
        $('#everything-else').css('display', 'inherit');
        $('#get_started_menu').css('display', 'none');
        $('#hide-get-started-menu').css('display', 'none');
        animateCSS('#everything-else', 'bounceInRight', function() {
            
        });
    });

    $('#show-get-started-menu-from-menu').click(function() {
            $('#get_started_menu').css('display', 'grid');
            $('#track_menu').css('display', 'none');
            $('#hide-menu').css('display', 'none');
            $('#hide-get-started-menu').css('display', 'inline-block');
            $('#get-started-option-list').css('display', 'grid');
            animateCSS('#get_started_menu', 'bounceInRight', function() {
                
            });
    });
    $('#show-get-started-menu').click(function() {
            $('#hide-menu').css('display', 'none');
            animateCSS('#everything-else', 'bounceOutRight', function() {
                $('#everything-else').css('display', 'none');
                $('#get_started_menu').css('display', 'grid');        
                $('#hide-get-started-menu').css('display', 'inline-block');   
                $('#get-started-option-list').css('display', 'grid');
                animateCSS('#get_started_menu', 'bounceInLeft', function() {

                });
            });

    });
    $('#show-map-from-menu').click(function(){
        $('#map').css('display', 'inherit');
        $('#track_menu').css('display', 'none');
        $('#hide-menu').css('display', 'none');
        map.resize();
        animateCSS('#map', 'bounceInRight', function() {
            $('#hide-map').css('display', 'inline-block');
            $('#launch-directions').css('display', 'inherit');
            animateCSS('#launch-directions', 'bounceInLeft', function() {

            });
            animateCSS('#hide-map', 'bounceInRight', function() {

            });
        });
    });
    $('#show-services').click(function(){
        $('#more_services').css('display', 'block');
        animateCSS('#more_services', 'bounceInLeft', function() {

        });
    });
    $('#hide-services').click(function(){
        animateCSS('#more_services', 'bounceOutLeft', function() {
            $('#menu_list_wrapper').css('display', 'inherit');
            $('#more_services').css('display', 'none');
            animateCSS('#menu_list_wrappers', 'bounceInLeft', function() {

            });
        });
    });

    $('#show-menu').click(function() {
        $('#track_menu').css('display', 'inherit');
        animateCSS('#track_menu', 'bounceInLeft', function() {
            $('#everything-else').css('display', 'none');
            $('#hide-menu').css('display', 'inline-block');
            animateCSS('#hide-menu', 'bounceInRight', function() {

            });
        });
    });
    $('#hide-menu').click(function(){
        $('#everything-else').css('display', 'inherit');
        $('#track_menu').css('display', 'none');
        $('#hide-menu').css('display', 'none');
        animateCSS('#everything-else', 'bounceInRight', function() {
            
        });
    });
    $('#showmap').click(function(){
        $('#map').css('display', 'inherit');
        $('#everything-else').css('display', 'none');
        map.resize();
        animateCSS('#map', 'bounceInRight', function() {
            $('#hide-map').css('display', 'inline-block');
            $('#launch-directions').css('display', 'inherit');
            animateCSS('#launch-directions', 'bounceInLeft', function() {

            });
            animateCSS('#hide-map', 'bounceInRight', function() {

            });
        });
   


    });
    $('#hide-map').click(function(){
        $('#map').css('display', 'none');
        $('#everything-else').css('display', 'inherit');
        $('#hide-map').css('display', 'none');
        $('#launch-directions').css('display', 'none');
    });

    $('#chat_signup').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            event.preventDefault();
            trychatsignup();
        }
    });            
     $('#go_chat_signup').click(function(e){
         trychatsignup();
     });

function trychatsignup() {
       
       var status = 0;
       var platein = $('#chat_signup').val();
       var plate = platein.replace(" ", "");
           plate = plate.replace("-", "");
           plate = plate.toLowerCase();
           plate = plate.replace("-", "");
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
               status = 10;
               
               window.location.href = 'https://chromemufflerbearing.com/c/message/' + plate;
           })
           .fail(function( xhr, status, errorThrown ) {
               if (status === 0) {
                    
               }
           })
           .always(function( xhr, status ) {

           });

   };



    $('#plate_signup').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            event.preventDefault();
            trysignup();
        }
    });            
     $('#signup').click(function(e){
         trysignup();

     });


    function trysignup() {
       
        var status = 0;
        var platein = $('#plate_signup').val();
        var plate = platein.replace(" ", "");
            plate = plate.replace("-", "");
            plate = plate.toLowerCase();
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
                status = 10;
                window.location.href = 'https://chromemufflerbearing.com/c/home/' + plate;
            })
            .fail(function( xhr, status, errorThrown ) {
                if (status === 0) {

                }
            })
            .always(function( xhr, status ) {

            });

    };
    var click1code = 0;
    function click1(name, extra, theurl) {
       
        $.ajax({
            type: "POST",
            url: "https://chromemufflerbearing.com/click/blog",
            data: {
                name: name,
                extra: extra
            }
        })
        .done(function( data ) {
            click1code = 1;
        })
        .fail(function( xhr, status, errorThrown ) {
            if (click1code === 0) {
    
            }
        })
        .always(function( xhr, status ) {
       });
    
    };

});



var loadinvoicelistcode = 0;
function loadbloglist() {
   
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/blog/list/published",
        data: {
            searchfor: 'nothing'
        }
    })
    .done(function( data ) {
        loadinvoicelistcode = 1;
        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        for (var i = 0; i < jsonData.length; ++i) {
            $('#actual_blog_list').append('<div class="two-col-border-style colorprimary"><div><img src="'+ jsonData[i].imageurl + '" class="blog-image"></div><div><h2 class="blog-article-list"><a href="https://chromemufflerbearing.com/1/blog/'+jsonData[i].blogname+'">'+jsonData[i].blognamepretty+'</a></h2></div>');
        }
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadinvoicelistcode === 0) {
            loadbloglist();
            loadinvoicelistcode = 1;
        }
    })
    .always(function( xhr, status ) {

   });

};


    function animateCSS(element, animationName, callback) {
            const node = document.querySelector(element)
            node.classList.add('animated', animationName)

            function handleAnimationEnd() {
                node.classList.remove('animated', animationName)
                node.removeEventListener('animationend', handleAnimationEnd)

                if (typeof callback === 'function') callback()
            }

            node.addEventListener('animationend', handleAnimationEnd)
        }

  