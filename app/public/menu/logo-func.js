$(function(){
   // setTimeout(logoslidein, 500);
   //logoslidein();
    function logoslidein() {
        $('#famelogo').css('display', 'inherit');
        animateCSS('#famelogo', 'slideInLeft', function() {
            //setTimeout(logoanimate, 4000);
        });
    }
    function logoanimate(){
        animateCSS('#famelogo', 'bounce', function() {
            //setTimeout(logoanimate, 3000);
        });
    }

    

});