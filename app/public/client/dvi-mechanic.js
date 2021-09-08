$(function(){
    loadvehicleinfo();
    $('#save_vehicle_details').click(function(){
        savevehicleinfo();
    });
    $('#save_whats_wrong').click(function(){
        saverepairreason();
        saveschedule();
    });
    $('#save_contact_details').click(function(){
        savecontactinfo();
    });

    var plate = $('#theplate').val();
    var token = $('#token').val();
    $('#message-left-panel').append('<a href="https://chromemufflerbearing.com/api/g/message/'+plate+'?token='+token+'"><h3 class="colorprimary big-button margin5 marginleft5">Message Inbox</h3></a>');
    $('#go-back-home').append('<a href="https://chromemufflerbearing.com/api/g/home/'+plate+'?token='+token+'"><h3 class="colorprimary big-button marginleft5">Home</h3></a>');
    $('#go-admin-home').append('<a href="https://chromemufflerbearing.com/api/home?token='+token+'"><h3 class="colorprimary big-button marginleft5">Admin Home</h3></a>');
    $('#go-customer-view').append('<a href="https://chromemufflerbearing.com/c/home/'+plate+'" target="_blank"><h3 class="colorprimary big-button marginleft5">Customer View</h3></a>');

});




var loadcarcode = 0;
var isfirstload = 0;
    function loadvehicleinfo() {
        var theymme = '';
        var plate = $('#theplate').val();
        $.ajax({
            type: "POST",
            url: "https://chromemufflerbearing.com/view/vehicle/",
            data: {
                plate: plate
            }
        })
        .done(function( data ) {
            loadcarcode = 1;
            var jsonStr = JSON.stringify(data);
            var jsonData = JSON.parse(jsonStr);
            var timestamp = 0;
            for (var i = 0; i < jsonData.length; ++i) {
                theymme = jsonData[i].year + ' ' + jsonData[i].make + ' ' + jsonData[i].model;
                
            }
            $('#vehicle-info-ymme').append('' + theymme + '');
            
            loadalertinfo();

        })
        .fail(function( xhr, status, errorThrown ) {
            if (loadcarcode === 0) {
                loadvehicleinfo();
            } 
        })
        .always(function( xhr, status ) {
            
        });
    };



var customername = '';
var loadalertinfocode = 0;
function loadalertinfo() {
    
    
    var howtofix = '';
    var plate = $('#theplate').val();
        $.ajax({
            type: "POST",
            url: "https://chromemufflerbearing.com/view/alert/info/",
            data: {
                plate: plate
            }
        })
        .done(function( data ) {
            loadalertinfocode = 1;
            var jsonStr = JSON.stringify(data);
            var jsonData = JSON.parse(jsonStr);
            var timestamp = 0;
            for (var i = 0; i < jsonData.length; ++i) {
                name = jsonData[i].name;
                
            }
            loadrepairreason();

        })
        .fail(function( xhr, status, errorThrown ) {
            if (loadalertinfocode === 0) {
                loadalertinfo();
            }
        })
        .always(function( xhr, status ) {

        });
};


var loadrepaircode = 0;
function loadrepairreason() {

var whatswrong = '';
var howtofix = '';
var plate = $('#theplate').val();
$.ajax({
    type: "POST",
    url: "https://chromemufflerbearing.com/view/repair/reason/",
    data: {
        plate: plate
    }
})
.done(function( data ) {
    loadrepaircode = 1;
    var jsonStr = JSON.stringify(data);
    var jsonData = JSON.parse(jsonStr);
    var timestamp = 0;
    for (var i = 0; i < jsonData.length; ++i) {
        whatswrong = jsonData[i].whatswrong;
        howtofix = jsonData[i].howtofix;
    }
    $('#customer-complaint').append('<h4>"' + whatswrong + '" - '+name+'</h4>');
    if (howtofix != null) {

    }
    loadstatus();


})
.fail(function( xhr, status, errorThrown ) {
    if (loadrepaircode === 0) {
       loadrepairreason();
    }
})
.always(function( xhr, status ) {

});
};




var loadschedulecode = 0;
    function loadschedule() {
    var scheduledtime = '';
    var messageline = '';
    var plate = $('#theplate').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/schedule/",
        data: {
            plate: plate
        }
    })
    .done(function( data ) {
        loadschedulecode = 1;
        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        var timestamp = 0;
        for (var i = 0; i < jsonData.length; ++i) {
            scheduledtime = jsonData[i].appointmenttime + ': ' + jsonData[i].appointment;
        }
        $('#status-short').append('' + scheduledtime + '');
        loadinvoicelist();

    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadschedulecode === 0) {
        loadschedule();              
        }
    })
    .always(function( xhr, status ) {

    });

};




var loadstatuscode = 0;
function loadstatus() {
    var thestatus = '';
    var thestatusimg = '';
    var plate = $('#theplate').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/status/",
        data: {
            plate: plate
        }
    })
    .done(function( data ) {
        loadstatuscode = 10;
        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        var timestamp = 0;

        for (var i = 0; i < jsonData.length; ++i) {
                if (jsonData[i].statustype == 'text') {
                    thestatus = jsonData[i].status;
                    $('#status-container-full').append('<div><h2>'+jsonData[i].nicetime+'</h2></div><div><h3>'+jsonData[i].status+'</h3></div>');
                }
                if (jsonData[i].statustype == 'upload') {
                    thestatusimg = jsonData[i].statusimg;
                    $('#status-container-full').append('<div><h2>'+jsonData[i].nicetime+'</h2></div><div><h3>'+jsonData[i].status+'</h3><img src="https://chromemufflerbearing.com/uploads/' + jsonData[i].statusimg + '" class="status-image"/></div>');
                }
        }
        loadschedule();

    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadstatuscode === 0) {
            loadstatus();
            
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
        $('#invoice-total-list').html('</br>');
        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        for (var i = 0; i < jsonData.length; ++i) {
            $('#invoice-total-list').append('<a href="https://chromemufflerbearing.com/api/g/invoice/'+plate+'/'+jsonData[i].invoiceid+'?token='+token+'"><p class="colorprimary little-button">' + jsonData[i].invoiceid + '</p></a>');
        }
        loadinspectionlist();
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadinvoicelistcode === 0) {
            loadinvoicelist();
        }
    })
    .always(function( xhr, status ) {

    });

};


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
        $('#inspection-list').html('</br>');
        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        for (var i = 0; i < jsonData.length; ++i) {
        $('#inspection-list').append('<a href="https://chromemufflerbearing.com/api/g/inspection/'+plate+'/'+jsonData[i].inspectionid+'?token='+token+'"><p class="colorprimary little-button">' + jsonData[i].inspectionid + '</p></a>');
        $('#inspectionid').val(jsonData[i].inspectionid);
        }
        //should be something to indicate it finished....
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadinspectioncode === 0) {
            loadinspectionlist();
        }
    })
    .always(function( xhr, status ) {
        
    });

};





    
var savecarcode = 0;
function savevehicleinfo() {
    var theymme = '';
    var plate = $('#theplate').val();
    var year = $('#vehicle_year').val();
    var make = $('#vehicle_make').val();
    var model = $('#vehicle_model').val();
    var vin = $('#vehicle_vin').val();

    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/edit/vehicle/info",
        data: {
            plate: plate,
            year: year,
            make: make,
            model: model,
            vin: vin
        }
    })
    .done(function( data ) {
        savecarcode = 1;
        $('#save-vehicle-return-status').append('Saved');
        var theymme = year + ' ' + make + ' ' + model;
        $('#vehicle-info-ymme').html('<h1>' + theymme + '</h1>');
        $('#vehicle-detail').css('display', 'none');
        if (isfirstload == 1) {
            $('#complaint-detail').css('display', 'inherit');
        }
    })
    .fail(function( xhr, status, errorThrown ) {
        if (savecarcode === 0) {
            savevehicleinfo();
        }
    })
    .always(function( xhr, status ) {

    });

};




var saverepaircode = 0;
function saverepairreason() {
    var whatswrong = '';
    var plate = $('#theplate').val();
    var whatswrongentry = $('#whats_wrong_entry').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/save/repair/reason/",
        data: {
            plate: plate,
            whatswrong: whatswrongentry
        }
    })
    .done(function( data ) {
        saverepaircode = 1;
        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        var timestamp = 0;
        for (var i = 0; i < jsonData.length; ++i) {
            whatswrong = jsonData[i].whatswrong;
        }
        $('#repair-reason').append('<h1>' + whatswrong + '</h1>');
        $('#repair-reason-2').html('<h1>' + whatswrong + '</h1>');
        
        loadrepairreason();
        if (isfirstload == 1) {
            $('#contact-detail').css('display', 'inherit');                
        }        
    })
    .fail(function( xhr, status, errorThrown ) {
        if (saverepaircode === 0) {
           saverepairreason();
           
        }
    })
    .always(function( xhr, status ) {

    });

};

var saveschedulecode = 0;
function saveschedule() {
    var whatswrong = '';
    var plate = $('#theplate').val();
    var thedate = $('#input_date').val();
    var thedate2 = $('.datepicker').val();
    var timeminutes = $('#input_time').val();
    var timeminutes2 = $('.timepicker').val();
    var appontment = thedate + ' ' + timeminutes;
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/save/repair/schedule/",
        data: {
            plate: plate,
            appointment: thedate,
            appointmenttime: timeminutes
        }
    })
    .done(function( data ) {
        saveschedulecode = 1;
        loadschedule();
        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        var timestamp = 0;
        for (var i = 0; i < jsonData.length; ++i) {
            whatswrong = jsonData[i].appointment;
        }
        $('#complaint-detail').css('display', 'none');
        if (isfirstload == 1) {
            $('#contact-detail').css('display', 'inherit'); 
        }
    })
    .fail(function( xhr, status, errorThrown ) {
        if (saveschedulecode === 0) {
           saveschedule();
           
        }
    })
    .always(function( xhr, status ) {

    });

};



var savecontactcode = 0;
function savecontactinfo() {
    var theymme = '';
    var plate = $('#theplate').val();
    var name = $('#contact_name').val();
    var phone = $('#contact_phone').val();
    var email = $('#contact_email').val();
    var alerttype = $('#contact_alert_type').val();
    var token = $('#token').val();

    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/edit/contact/info",
        data: {
            plate: plate,
            name: name,
            phone: phone,
            email: email,
            alerttype: alerttype
        }
    })
    .done(function( data ) {
        savecontactcode = 1;
        $('#save-vehicle-return-status').append('Saved');
        $('#contact-detail').css('display', 'none');
        if (isfirstload == 1) {
            window.location.href = 'https://chromemufflerbearing.com/api/g/home/' + plate + '?token=' + token;
        }
       
    })
    .fail(function( xhr, status, errorThrown ) {
        if (savecontactcode === 0) {
           savecontactinfo();
        }
    })
    .always(function( xhr, status ) {

    });

};
