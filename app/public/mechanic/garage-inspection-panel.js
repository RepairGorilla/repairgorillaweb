$(function() {
    var isFirstLoad = 0;
    loadinspectionpartlist();

    var plate = $('#theplate').val();
    var token = $('#token').val();
    $('#message-left-panel').append('<a href="https://chromemufflerbearing.com/api/g/message/'+plate+'?token='+token+'"><h3 class="colorprimary big-button margin5 marginleft5">Message Inbox</h3></a>');
    $('#go-back-home').append('<a href="https://chromemufflerbearing.com/api/g/home/'+plate+'?token='+token+'"><h3 class="colorprimary big-button marginleft5">Home</h3></a>');
    $('#go-admin-home').append('<a href="https://chromemufflerbearing.com/api/home?token='+token+'"><h3 class="colorprimary big-button marginleft5">Admin Home</h3></a>');
    $('#go-customer-view').append('<a href="https://chromemufflerbearing.com/c/home/'+plate+'" target="_blank"><h3 class="colorprimary big-button marginleft5">Customer View</h3></a>');


    
        $('#close-inspection-note').click(function(){
            animateCSS('#screen_settings', 'slideOutRight', function() {
            $('#screen_settings').css('display', 'none');
            closeotherscreens();
            $('#home_screen').css('display', 'grid');   
                animateCSS('#home_screen', 'slideInRight', function() {

                });
            });
            
        });

        $('#open-sendtext-screen').click(function(){
            
            closeotherscreens();
            $('#sendtext_screen').css('display', 'grid');
                animateCSS('#sendtext_screen', 'slideInRight', function() {

                });
            
        });

        $('#close-sendtext-screen').click(function(){
            animateCSS('#sendtext_screen', 'slideOutRight', function() {
  
            $('#sendtext_screen').css('display', 'none');
            closeotherscreens();
            $('#home_screen').css('display', 'grid');   
                animateCSS('#home_screen', 'slideInRight', function() {
                  
                });
            });
            
        });

        $('#open-partlist-screen').click(function(){
           
            closeotherscreens();
            $('#modify_partlist_screen').css('display', 'grid');
                animateCSS('#modify_partlist_screen', 'slideInRight', function() {

                });
            
        });

        $('#close-partlist-screen').click(function(){
            animateCSS('#modify_partlist_screen', 'slideOutRight', function() {
            $('#modify_partlist_screen').css('display', 'none');
            closeotherscreens();
            $('#home_screen').css('display', 'grid');   
                animateCSS('#home_screen', 'slideInRight', function() {
                  
                });
            });
            
        });

        function closeotherscreens() {
            $('#home_screen').css('display', 'none');
            $('#screen_settings').css('display', 'none');
            $('#modify_partlist_screen').css('display', 'none');        
            $('#sendtext_screen').css('display', 'none');        
        }


        $('#save_inspection_note').click(function(){
            var partid = $('#selected_partid').val();
            savedetails(partid);
        });
        
    
        $('#addpart').click(function(){
          
            saveparttolist();
        });
        function saveparttolist() {
            var status = 0;
            var token = $('#token').val();
            var parttoadd = $('#part_to_add').val();
            var partlist = $('#part_list').val();

            $.ajax({
                    url: "https://chromemufflerbearing.com/api/add/inspection/list/part",
                    data: {
                        token: token,
                        part: parttoadd,
                        listid: partlist
                    },
                    type: "POST"
            })
            .done(function( data ) {
                status = 10;
                var jsonStr = JSON.stringify(data);
                var jsonData = JSON.parse(jsonStr);
                $('#addpart-status').append('<h3 class="colorprimary">'+parttoadd+'/'+partlist+' Saved </h3>');
                for (var i = 0; i < jsonData.length; ++i) {

                }
            })
            .fail(function( xhr, status, errorThrown ) {
                if (status === 0) {

                }
                $("#outputreturn_signup").append(" Fail ");
            })
            .always(function( xhr, status ) {
                $("#outputreturn_signup").append(" Always ");
            });
    
        };            
                    
    $('#save_inspection_row').click(function(){
        var saveinspectionpart = 0;
        var whatswrong = '';
        var plate = $('#theplate').val();
            var token = $('#token').val();
            var partdesc = $('#part_desc').val();
            var partcondition = $('#part_condition').val();
            var inspectionid = $('#inspectionid').val();
            $.ajax({
                type: "POST",
                url: "https://chromemufflerbearing.com/api/save/inspection/part",
                data: {
                    token: token,
                    plate: plate,
                    partdesc: partdesc,
                    partcondition: partcondition,
                    inspectionid: inspectionid
                }
            })
            .done(function( data ) {
                saveinspectionpart = 1;
                var jsonStr = JSON.stringify(data);
                var jsonData = JSON.parse(jsonStr);
                for (var i = 0; i < jsonData.length; ++i) {
                    $('#invoice-parts-list').append('<div>'+jsonData[i].partdesc+'</div><div>'+jsonData[i].partcondition+'</div><div></div>');
                }
            })
            .fail(function( xhr, status, errorThrown ) {
                if (saveinspectionpart === 0) {
                    savehowtofix();
                }
            })
            .always(function( xhr, status ) {
                $('#save-resolution-return-status').append('always');
            });

    });




    
    var loadinspectionpartcode = 0;
    function loadinspectedparts() {

        var whatswrong = '';
        var plate = $('#theplate').val();
            var token = $('#token').val();
            var inspectionid = $('#inspectionid').val();
            $.ajax({
                type: "POST",
                url: "https://chromemufflerbearing.com/api/view/inspection/part",
                data: {
                    token: token,
                    plate: plate,
                    inspectionid: inspectionid
                }
            })
            .done(function( data ) {
                loadinspectionpartcode = 1;
                var jsonStr = JSON.stringify(data);
                var jsonData = JSON.parse(jsonStr);
                for (var i = 0; i < jsonData.length; ++i) {
                    $('#onl' + jsonData[i].partid+'wrapper').replaceWith('<div class="inspection-panel"><a href="#" onclick="opendetails(\''+jsonData[i].partid+'\',\''+jsonData[i].notes+'\', \''+jsonData[i].photourl+'\', \''+jsonData[i].partdesc+'\');">Attach image: '+jsonData[i].partdesc+'</a></div><div></div>'); 
                    if (jsonData[i].partcondition === 'red') {
                        $('#onl' + jsonData[i].partid + 'r').css('background-color', '#000000');
                        $('#onl' + jsonData[i].partid + 'y').css('background-color', '#ffffff');
                        $('#onl' + jsonData[i].partid + 'g').css('background-color', '#ffffff');            
                    }
                    if (jsonData[i].partcondition === 'yellow') {
                        $('#onl' + jsonData[i].partid + 'y').css('background-color', '#000000');
                        $('#onl' + jsonData[i].partid + 'r').css('background-color', '#ffffff');
                        $('#onl' + jsonData[i].partid + 'g').css('background-color', '#ffffff');
                    }
                    if (jsonData[i].partcondition === 'green') {
                        $('#onl' + jsonData[i].partid + 'g').css('background-color', '#000000');
                        $('#onl' + jsonData[i].partid + 'y').css('background-color', '#ffffff');
                        $('#onl' + jsonData[i].partid + 'r').css('background-color', '#ffffff');
                    }

              



                }
                if (isFirstLoad == 0) {
                    loadinspectionlist();
                }

            })
            .fail(function( xhr, status, errorThrown ) {
                if (loadinspectionpartcode === 0) {
                    loadinspectedparts();
                }
            })
            .always(function( xhr, status ) {
                $('#save-resolution-return-status').append('always');
                //$("#recent-status").append(" Always " + plate);
            });

    };

    $('.open-edit-part').click(function(){
        alert('yep');
    });

    var jkw = 'jkw';
    var inspectionform = ''
    inspectionform = inspectionform + '<div><form action="#" class="carymme-form"><input type="text" class="carymme" id="part_desc" name="part_desc"></div>';
    inspectionform = inspectionform + '<div><input type="text" class="carymme" id="part_condition" name="part_condition"></div>';
    inspectionform = inspectionform + '<div><button class="save-button" id="onl" onclick="gogo(\''+jkw+'\');" >good</button></div>';
    $('#invoice-parts-list').append(inspectionform);


    var loadinspectionlistcode = 0;
    function loadinspectionpartlist() {
        //list of parts to inspect
        var whatswrong = '';
            var token = $('#token').val();
            $.ajax({
                type: "POST",
                url: "https://chromemufflerbearing.com/api/view/inspection/part/list/all",
                data: {
                    token: token
                }
            })
            .done(function( data ) {
                loadinspectionlistcode = 1;
                var jsonStr = JSON.stringify(data);
                var jsonData = JSON.parse(jsonStr);
                $('#inspection-part-list').html('</br>');
                for (var i = 0; i < jsonData.length; ++i) {
                    $('#inspection-part-list').append('<div></div><div style="margin-top:8%;">'+jsonData[i].part+'</div>'); 
                    //timestamp from the part list is the partid, kinda weird.

                    var jkw = 'jkw';
                    var inspectionform = ''
                    
                    inspectionform = inspectionform + '<div id="onl'+jsonData[i].timestamp+'wrapper"></div><div><button class="save-button" id="onl'+jsonData[i].timestamp+'r" onclick="inspectpart(\''+jsonData[i].part+'\', \'red\', \''+jsonData[i].timestamp+'\', \''+jsonData[i].timestamp+'\');" >Red</button>';
                    inspectionform = inspectionform + '<button class="save-button" id="onl'+jsonData[i].timestamp+'y" onclick="inspectpart(\''+jsonData[i].part+'\', \'yellow\', \''+jsonData[i].timestamp+'\', \''+jsonData[i].timestamp+'\');" >Yellow</button>';
                    inspectionform = inspectionform + '<button class="save-button" id="onl'+jsonData[i].timestamp+'g" onclick="inspectpart(\''+jsonData[i].part+'\', \'green\', \''+jsonData[i].timestamp+'\', \''+jsonData[i].timestamp+'\');" >Green</button></div>';
                    $('#inspection-part-list').append(inspectionform);            

                }
                loadinspectedparts();

            
            })
            .fail(function( xhr, status, errorThrown ) {
                if (loadinspectionlistcode === 0) {
                    loadinspectionpartlist();
                }
            })
            .always(function( xhr, status ) {
                $('#save-resolution-return-status').append('always');
            });
    }
    var loadinspectioncode = 0;
    function loadinspectionlist() {
    var plate = $('#theplate').val();
    var token = $('#token').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/inspection/list",
        data: {
            plate: plate
        }
    })
    .done(function( data ) {
        loadinspectioncode = 1;

        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        for (var i = 0; i < jsonData.length; ++i) {
            $('#inspection-list').append('<a href="https://chromemufflerbearing.com/api/g/inspection/'+plate+'/'+jsonData[i].inspectionid+'?token='+token+'"><p class="colorprimary little-button">' + jsonData[i].inspectionid + '</p></a>');
        }
        
            loadinvoicelist();
        
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadinspectioncode === 0) {
            loadinspectionlist();
        }
    })
    .always(function( xhr, status ) {

    });

    };


var loadinvoicelistcode = 0;
function loadinvoicelist() {
    var plate = $('#theplate').val();
    var token = $('#token').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/repair/invoice/list",
        data: {
            plate: plate
        }
    })
    .done(function( data ) {
        loadinvoicelistcode = 1;

        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        for (var i = 0; i < jsonData.length; ++i) {
            $('#invoiceid').val(jsonData[i].invoiceid);
            $('#invoice-total-list').append('<a href="https://chromemufflerbearing.com/api/g/invoice/'+plate+'/'+jsonData[i].invoiceid+'?token='+token+'"><p class="colorprimary little-button">' + jsonData[i].invoiceid + '</p></a>');
        }
        isFirstLoad = 1;
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadinvoicelistcode === 0) {
            loadinvoicelist();
        }
    })
    .always(function( xhr, status ) {

    });

};

});




    function opendetails(partid, notes, photourl, partdesc) {
        $('#inspected-part-description').html('</br>');
        $('#inspected-part-description').html('<h3>' + partdesc + '</h3>');
        $('#selected_partid').val(partid);
        
        $('#inspection_note').val(notes);
        $('#inspection_photourl').val(photourl);

        animateCSS('#home_screen', 'slideOutRight', function() {
            $('#home_screen').css('display', 'none');
                $('#screen_settings').css('display', 'grid');
                animateCSS('#screen_settings', 'slideInRight', function() {

                });
        });
        

    }

    function savedetails(partid) {
        var plate = $('#theplate').val();
        var token = $('#token').val();
        var inspectionid = $('#inspectionid').val();
        var inspectionnote = $('#inspection_note').val();
        var inspectionphotourl = $('#inspection_photourl').val();

        $.ajax({
            type: "POST",
            url: "https://chromemufflerbearing.com/api/edit/inspection/part",
            data: {
                token: token,
                plate: plate,
                notes: inspectionnote,
                photourl: inspectionphotourl,
                partid: partid,
                inspectionid: inspectionid
            }
        })
        .done(function( data ) {
            saveinspectionpart = 1;
            var jsonStr = JSON.stringify(data);
            var jsonData = JSON.parse(jsonStr);
            for (var i = 0; i < jsonData.length; ++i) {
                $('#onl' + jsonData[i].partid+'wrapper').replaceWith('<div class="inspection-panel"><a href="#" onclick="opendetails(\''+jsonData[i].partid+'\',\''+jsonData[i].notes+'\', \''+jsonData[i].photourl+'\', \''+jsonData[i].partdesc+'\');">Attach image: '+jsonData[i].partdesc+'</a></div><div></div>'); 
            }
            $('#inspection_note').val('');
            $('#inspection_photourl').val('');

                animateCSS('#screen_settings', 'slideOutRight', function() {
                    $('#screen_settings').css('display', 'none');
                    $('#home_screen').css('display', 'grid');   
                        animateCSS('#home_screen', 'slideInRight', function() {
                            loadinspectionpartlist();
                        });
                });

        })
        .fail(function( xhr, status, errorThrown ) {
            if (saveinspectionpart === 0) {

            }
        })
        .always(function( xhr, status ) {
            $('#save-resolution-return-status').append('always');
        });
    }

    function inspectpart(inspectedpart, condition, index, partid) {
    
        
        var saveinspectionpart = 0;
        var whatswrong = '';
        if (condition === 'red') {
            $('#onl' + index + 'r').css('background-color', '#000000');
            $('#onl' + index + 'y').css('background-color', '#ffffff');
            $('#onl' + index + 'g').css('background-color', '#ffffff');
        }
        if (condition === 'yellow') {
            $('#onl' + index + 'y').css('background-color', '#000000');
            $('#onl' + index + 'r').css('background-color', '#ffffff');
            $('#onl' + index + 'g').css('background-color', '#ffffff');
        }
        if (condition === 'green') {
            $('#onl' + index + 'g').css('background-color', '#000000');
            $('#onl' + index + 'y').css('background-color', '#ffffff');
            $('#onl' + index + 'r').css('background-color', '#ffffff');
        }

            var plate = $('#theplate').val();
            var token = $('#token').val();
            var inspectionid = $('#inspectionid').val();

            $.ajax({
                type: "POST",
                url: "https://chromemufflerbearing.com/api/edit/inspection/part",
                data: {
                    token: token,
                    plate: plate,
                    partdesc: inspectedpart,
                    partcondition: condition,
                    partid: partid,
                    inspectionid: inspectionid
                }
            })
            .done(function( data ) {
                saveinspectionpart = 1;
                var jsonStr = JSON.stringify(data);
                var jsonData = JSON.parse(jsonStr);
                for (var i = 0; i < jsonData.length; ++i) {
                    $('#onl' + jsonData[i].partid+'wrapper').replaceWith('<div class="inspection-panel"><a href="#" onclick="opendetails(\''+jsonData[i].partid+'\',\''+jsonData[i].notes+'\', \''+jsonData[i].photourl+'\', \''+jsonData[i].partdesc+'\');">Attach image: '+jsonData[i].partdesc+'</a></div><div></div>'); 
                }
            })
            .fail(function( xhr, status, errorThrown ) {
                if (saveinspectionpart === 0) {
                    savehowtofix();
                }
            })
            .always(function( xhr, status ) {
                $('#save-resolution-return-status').append('always');
            });
    
       
    
    }



