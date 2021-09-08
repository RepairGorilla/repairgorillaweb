let menuopen = 0;
let midmenuopen = 0;
$(function(){
    if(window.innerWidth >= 1024) {
        $('.everything-wrapper').css({'width': '95%'});
        $('#mid_left_menu').css({'display': 'none'});
        $('#chat_thread').css({'display': '95%'});
        midmenuopen = 0;
    }

    $('#close_mid_menu').click(function(){
        if(window.innerWidth >= 1024) {
            if (midmenuopen === 1) {
                $('.everything-wrapper').css({'width': '95%'});
                $('#mid_left_menu').css({'display': 'none'});
                $('#chat_thread').css({'display': '95%'});
                midmenuopen = 0;
                return;    
            }
            if (midmenuopen === 0) {
                $('.everything-wrapper').css({'width': '75%'});
                $('#chat_thread').css({'display': '75%'});
                $('#mid_left_menu').css({'display': 'inherit'});
                midmenuopen = 1;
                return;
            }
        } else {
            
        }
    });

    $('#close-menu').click(function(){
        animateCSS('#left-gutter', 'slideOutLeft', function() {
            $('#left-gutter').css('display', 'none');
            $('#close-menu').css('display', 'none');
            $('#open-menu').css('display', 'inherit');
        });
    
    });
    $('#open-menu').click(function(){
            $('#left-gutter').css('display', 'grid');
            animateCSS('#left-gutter', 'slideInLeft', function() {
                $('#open-menu').css('display', 'none');
                $('#close-menu').css('display', 'inherit');
            });
    });


    $('#open-panel-home').click(function(){
        toggleMidMenu();
        animateCSS('.mid-left', 'slideOutLeft', function() {
        hideAllPanels();
        $('#mid-left-panel-home').css('display', 'grid');   
            animateCSS('.mid-left', 'slideInLeft', function() {

            });
        });
    });
    $('#open-panel-inspection').click(function(){
        toggleMidMenu();
        animateCSS('.mid-left', 'slideOutLeft', function() {
        hideAllPanels();
        $('#mid-left-panel-inspection').css('display', 'grid');   
            animateCSS('.mid-left', 'slideInLeft', function() {

            });
        });
    });
    $('#open-panel-message').click(function(){
        toggleMidMenu();
        animateCSS('.mid-left', 'slideOutLeft', function() {
        hideAllPanels();
        $('#mid-left-panel-message').css('display', 'grid');   
            animateCSS('.mid-left', 'slideInLeft', function() {

            });
        });
    });                    
    $('#open-panel-invoice').click(function(){
        toggleMidMenu();
        animateCSS('.mid-left', 'slideOutLeft', function() {
        hideAllPanels();
        $('#mid-left-panel-invoice').css('display', 'grid');   
            animateCSS('.mid-left', 'slideInLeft', function() {

            });
        });
    });                    
    $('#close-settings').click(function(){
        animateCSS('#screen_settings', 'slideOutRight', function() {
        
        $('#screen_settings').css('display', 'none');
        $('#home_screen').css('display', 'grid');   
            animateCSS('#home_screen', 'slideInRight', function() {

            });
        });
    });
    $('#open-settings-main').click(function(){
        animateCSS('#home_screen', 'slideOutRight', function() {
        
        $('#home_screen').css('display', 'none');
        $('#screen_settings').css('display', 'grid');   
            animateCSS('#screen_settings', 'slideInUp', function() {

            });
        });
    });


    $('#close-waiver').click(function(){
        animateCSS('#waiver_screen', 'slideOutRight', function() {
        
        $('#waiver_screen').css('display', 'none');
        $('#home_screen').css('display', 'grid');   
            animateCSS('#home_screen', 'slideInRight', function() {

            });
        });
    });



});
function toggleMidMenu() {
    if(window.innerWidth >= 1024) {
        
        if (midmenuopen === 0) {
            $('.everything-wrapper').css({'width': '75%'});
            $('#chat_thread').css({'display': '75%'});
            $('#mid_left_menu').css({'display': 'inherit'});
            midmenuopen = 1;
            return;
        }
    } else {
        
        
    }

}

function hideAllPanels() {
$('#mid-left-panel-home').css('display', 'none'); 
$('#mid-left-panel-inspection').css('display', 'none'); 
$('#mid-left-panel-message').css('display', 'none'); 
$('#mid-left-panel-invoice').css('display', 'none'); 
}
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