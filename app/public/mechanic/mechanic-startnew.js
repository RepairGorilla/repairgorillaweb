
    
        $(function(){

            $('#start_new_inspection').click(function(){
                startinspection();
            });

            $('#start_new_invoice').click(function(){
                startinvoice();
            });

            $('#save_current_car_status').click(function(){
                savenewstatus();
            });


       
            var savestatuscodestatus = 0;
            function savenewstatus() {
                var whatswrong = '';
                var plate = $('#theplate').val();
                var token = $('#token').val();
                var status = $('#current_car_status').val();
                var datetimenow = moment().format('hh:mm a MM.DD.YYYY');
                $.ajax({
                    type: "POST",
                    url: "https://chromemufflerbearing.com/api/save/repair/status",
                    data: {
                        token: token,
                        plate: plate,
                        status: status,
                        statustype: 'text',
                        nicetime: datetimenow                
                    }
                })
                .done(function( data ) {
                    savestatuscodestatus = 1;            
                    $('#status-container-full').append('<div><h2>'+datetimenow+'</h2></div><div><h3>'+status+'</h3></div>');
                    document.querySelector('#status-container-full').scrollIntoView({
                        behavior: 'smooth' 
                    });
                    $('#current_car_status').val('');
                })
                .fail(function( xhr, status, errorThrown ) {
                    if (savestatuscodestatus === 0) {
                       
                    }
                })
                .always(function( xhr, status ) {
        
                });
        
            };        


            var savestatuscodestatus2 = 0;
    function savenewstatus2() {
        var whatswrong = '';
        var plate = $('#theplate').val();
        var token = $('#token').val();
        var status = $('#current_car_status').val();
        $.ajax({
            type: "POST",
            url: "https://chromemufflerbearing.com/api/save/repair/status",
            data: {
                token: token,
                plate: plate,
                status: status,
                statustype: 'text'
            }
        })
        .done(function( data ) {
            savestatuscodestatus = 1;            
        })
        .fail(function( xhr, status, errorThrown ) {
            if (savestatuscodestatus === 0) {
                savenewstatus();
            }
        })
        .always(function( xhr, status ) {
            $('#save-resolution-return-status').append('always');
           
        });

    };        



   var startinvoicecode = 0;
    function startinvoice() {
        var plate = $('#theplate').val();
        var token = $('#token').val();
        var vehicleid = $('#vehicleid').val();
        $.ajax({
            type: "POST",
            url: "https://chromemufflerbearing.com/api/start/new/invoice",
            data: {
                token: token,
                plate: plate,
                vehicleid: vehicleid,
                invoicestatus: 'unpaid',
                typeof: 'invoice',
                workdesc: 'automotive repair...'
            }
        })
        .done(function( data ) {
            startinvoicecode = 1;

            var jsonStr = JSON.stringify(data);
            var jsonData = JSON.parse(jsonStr);
            for (var i = 0; i < jsonData.length; ++i) {
                $('#invoice-total-list').append('<h5><a href="https://chromemufflerbearing.com/api/g/invoice/'+plate+'/'+jsonData[i].invoiceid+'?token='+token+'">' + jsonData[i].invoiceid + '</a></h5>');   
                $('#part_invoice_id').val(jsonData[i].invoiceid);
                $('#hour_invoice_id').val(jsonData[i].invoiceid);
            }

        })
        .fail(function( xhr, status, errorThrown ) {
            if (startinvoicecode === 0) {
                startinvoice();
            }
        })
        .always(function( xhr, status ) {

        });

    };




    var startinspectioncode = 0;
    function startinspection() {
        var plate = $('#theplate').val();
        var token = $('#token').val();
        var vehicleid = $('#vehicleid').val();
        $.ajax({
            type: "POST",
            url: "https://chromemufflerbearing.com/api/start/new/inspection",
            data: {
                token: token,
                plate: plate,
                vehicleid: vehicleid,
                inspectionstatus: 'new'
            }
        })
        .done(function( data ) {
            startinspectioncode = 1;

            var jsonStr = JSON.stringify(data);
            var jsonData = JSON.parse(jsonStr);
            for (var i = 0; i < jsonData.length; ++i) {
                $('#inspection-list').append('<h4><a href="https://chromemufflerbearing.com/api/g/inspection/'+plate+'/'+jsonData[i].inspectionid+'?token='+token+'">' + jsonData[i].inspectionid + '</a></h4>');
            }

        })
        .fail(function( xhr, status, errorThrown ) {
            if (startinspectioncode === 0) {
                startinspection();
            }
        })
        .always(function( xhr, status ) {
            
        });

    };



    });