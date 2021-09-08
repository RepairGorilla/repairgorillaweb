$(function(){
    $('#save-invoice').click(function(){
        loadthisinvoiceforsave();
    });
    
});

var savedinvoice = '';
var savedapproval = '';
var savedexpectedcompletioninitial = '';
var savedexpectedcompletion = '';
var savedapprovalstatus = '';
var savedterms = '';
var savedwaiverlist = '';
var savepartrowcode = 0;
var invoicegrandtotal = 0;
var invoicetotalpartprice = 0;
var invoicetotallaborprice = 0;



var loadthisinvoiceforsavecode = 0;
function loadthisinvoiceforsave() {

    savedinvoice = '';
     savedapproval = '';
     savedexpectedcompletioninitial = '';
     savedexpectedcompletion = '';
     savedapprovalstatus = '';
     savedwaiverlist = '';
     savedterms = '';

    var workdescription = '';
    savedinvoice = '';
    savedinvoice = savedinvoice + '<div class="two-col-grid">';
    var plate = $('#theplate').val();
    var invoiceid = $('#invoiceid').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/repair/invoice/single",
        data: {
            plate: plate,
            invoiceid: invoiceid
        }
    })
    .done(function( data ) {
        loadthisinvoiceforsavecode = 1;
        savedinvoice = savedinvoice + '<div class="invoice-border"><div>';
        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        for (var i = 0; i < jsonData.length; ++i) {
            savedapprovalstatus = jsonData[i].approvalstatus;
            savedinvoice = savedinvoice + '<h3>Invoice: ' + jsonData[i].invoiceid + '</h3>';
            savedinvoice = savedinvoice + '<h4>Name: ' + jsonData[i].invoicecustomername + '</h4>';
            savedinvoice = savedinvoice + '<h4>Phone: ' + jsonData[i].plate + '</h4>';
            savedinvoice = savedinvoice + '<h4>Address: ' + jsonData[i].invoiceaddress + '</h4>';
            if (jsonData[i].typeof === 'invoice') {
                savedinvoice = savedinvoice + '<h4>Invoice</h4>';
            }
            if (jsonData[i].typeof === 'workorder') {
                savedinvoice = savedinvoice + '<h4>Work Order ' + jsonData[i].invoicestatus + '</h4>';
            }
            savedinvoice = savedinvoice + '<h4>Registration: ' + jsonData[i].invoiceregistrationnumber + '</h4>';
            savedinvoice = savedinvoice + '<h4>Mileage: ' + jsonData[i].invoiceodometer + '</h4>';
            savedinvoice = savedinvoice + '<h4>Year Make: ' + jsonData[i].invoiceyearmake + '</h4>';
            savedinvoice = savedinvoice + '</div></div>';
            savedinvoice = savedinvoice + '<div><div class="invoice-border"><div>';
            savedinvoice = savedinvoice + '<h2>Your Garage</h4>';
            savedinvoice = savedinvoice + '<h4>Address:</h4>';
            savedinvoice = savedinvoice + '<h4>Phone:</h4>';
            savedinvoice = savedinvoice + '<h4>Invoice By: ' +jsonData[i].invoicesignature + '</h4>';
            savedinvoice = savedinvoice + '<h4>THANK YOU!</h4>';
            savedinvoice = savedinvoice + '</div></div><div class="logo"></div></div>';
            savedinvoice = savedinvoice + '</div>';
            savedinvoice = savedinvoice + '<div class="one-col-grid margin5 invoice-border"><div><h3>Description:</h3><h5>' + jsonData[i].workdesc + '</h5></div></div>';
            savedexpectedcompletioninitial = savedexpectedcompletioninitial + '<h5>Expected Done Date ' + jsonData[i].expecteddate + '</h5>';            
            
          
        }
        
        loadapprovalforsave();
       
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadthisinvoiceforsavecode === 0) {
            loadthisinvoiceforsave();
        }
    })
    .always(function( xhr, status ) {

    });

};

var loadapprovalforsavecode = 0;
function loadapprovalforsave() {
    var plate = $('#theplate').val();
    var invoiceid = $('#invoiceid').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/invoice/approval",
        data: {
            plate: plate,
            invoiceid: invoiceid
        }
    })
    .done(function( data ) {
        loadapprovalforsavecode = 1;

        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        for (var i = 0; i < jsonData.length; ++i) {
            savedapproval = savedapproval + '<div class="one-col-grid"><div class="margin5">';        
            savedapproval = savedapproval + '<h3>Approved: ' + jsonData[i].approvalstatus + '</h3>';
            savedapproval = savedapproval + '<h3>Signed: ' + jsonData[i].approvalsignature + '</h3>';
            savedapproval = savedapproval + '<h3>At: ' + jsonData[i].nicetime + ' UTC </h3>';
            savedapproval = savedapproval + '</div></div>';
        }
        if (savedapprovalstatus === 'unanswered') {
            savedapproval = savedapproval + '<div class="one-col-grid"><div class="margin5">';
            savedapproval = savedapproval + '<p>Circle one</p><div class="parts-col-grid"><div><h2>YES</h2></div><div><h2>NO</h2></div></div>';
            savedapproval = savedapproval + '</div></div>'
            savedapproval = savedapproval + '<div class="one-col-grid invoice-border"><div class="margin5">';
            savedapproval = savedapproval + '<h1>SIGN</h1>';
            savedapproval = savedapproval + '</div></div>'
        }

        loadcheckindateforsave();
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadapprovalforsavecode === 0) {
            loadapprovalforsave();
        }
    })
    .always(function( xhr, status ) {

    });

};


var loadcheckindateforsavecode = 0;
function loadcheckindateforsave() {
    var plate = $('#theplate').val();
    var invoiceid = $('#invoiceid').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/checkin/status",
        data: {
            plate: plate
        }
    })
    .done(function( data ) {
        loadcheckindateforsavecode = 1;

        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        for (var i = 0; i < jsonData.length; ++i) {
            savedapproval = savedapproval + '<div class="one-col-grid"><div class="margin5">';        
            savedapproval = savedapproval + '<h3>Checked in at: ' + jsonData[i].nicetime + '</h3>';
            savedapproval = savedapproval + '</div></div>';
        }

        loadexpecteddatelistforsave();
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadcheckindateforsavecode === 0) {
            loadcheckindateforsave();
        }
    })
    .always(function( xhr, status ) {

    });

};


var loadexpecteddatelistforsavecode = 0;
function loadexpecteddatelistforsave() {
    var plate = $('#theplate').val();
    var invoiceid = $('#invoiceid').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/expected/date/list",
        data: {
            plate: plate,
            invoiceid: invoiceid
        }
    })
    .done(function( data ) {
        loadexpecteddatelistforsavecode = 1;

        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        savedexpectedcompletion = savedexpectedcompletion + '<div class="one-col-grid margin5 invoice-border">'
        savedexpectedcompletion = savedexpectedcompletion + '<div>';
        savedexpectedcompletion = savedexpectedcompletion + savedexpectedcompletioninitial;
        for (var i = 0; i < jsonData.length; ++i) {   
            savedexpectedcompletion = savedexpectedcompletion + '<h5>Expected Done Date ['+i+']' + jsonData[i].donedate + '</h5>';
        }
        savedexpectedcompletion = savedexpectedcompletion + '</div></div>';
        loadpartlistgarageforsave();
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadexpecteddatelistforsavecode === 0) {
            loadexpecteddatelistforsave();
        }
    })
    .always(function( xhr, status ) {

    });

};




var loadpartcode = 0;
function loadpartlistgarageforsave() {
    var theymme = '';
    var token = $('#token').val();
    var plate = $('#theplate').val();
    var invoiceid = $('#invoiceid').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/repair/part/",
        data: {
            plate: plate,
            invoiceid: invoiceid
        }
    })
    .done(function( data ) {
        loadpartcode = 1;
        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        var timestamp = 0;

       savedinvoice = savedinvoice + '<div class="two-col-grid">';
       savedinvoice = savedinvoice + '<div class="parts-col-grid margin5 invoice-border">';
        savedinvoice = savedinvoice + '<div><h3>Part</h3></div><div><h3>Price</h3></div>'
        for (var i = 0; i < jsonData.length; ++i) {
           
            var theprice = parseInt(jsonData[i].partprice);
            var thecount = parseInt(jsonData[i].partcount);
            var thelinetotal = theprice * thecount;
            invoicetotalpartprice = invoicetotalpartprice + thelinetotal;
            var j = i + 1;
            savedinvoice = savedinvoice + '<div>';
            savedinvoice = savedinvoice + '<h4>'+jsonData[i].part+'</h4>';
            savedinvoice = savedinvoice + '<h5>Condition: '+jsonData[i].partcondition+'</h5>';
            savedinvoice = savedinvoice + '<h5>Part Number: '+jsonData[i].partnumber+'</h5>';
            savedinvoice = savedinvoice + '</div>';
            savedinvoice = savedinvoice + '<div>';
            savedinvoice = savedinvoice + '<h4>$'+jsonData[i].partprice + ' x '+jsonData[i].partcount+'</h4>';
            savedinvoice = savedinvoice + '<h4>$'+thelinetotal + '</h4>';
            savedinvoice = savedinvoice + '</div>';

        }

        savedinvoice = savedinvoice + '</div>';

        invoicegrandtotal = invoicegrandtotal + invoicetotalpartprice;
        invoicegrandtotal = Math.round(invoicegrandtotal);
        loadlaborlistgarageforsave();
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadpartcode === 0) {
           loadpartlistgarageforsave();
        }
    })
    .always(function( xhr, status ) {

    });

};


function loadlaborlistgarageforsave() {
    var theymme = '';
    var plate = $('#theplate').val();
    var invoiceid = $('#invoiceid').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/repair/hour/",
        data: {
            plate: plate,
            invoiceid: invoiceid
        }
    })
    .done(function( data ) {
        loadlaborcode = 1;
        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        var timestamp = 0;
    
        savedinvoice = savedinvoice + '<div class="parts-col-grid margin5 invoice-border">';
        for (var i = 0; i < jsonData.length; ++i) {
            
            var theprice = parseFloat(jsonData[i].hourprice);
            var thehours = parseFloat(jsonData[i].hours);
            var linetotal = theprice * thehours;
            invoicetotallaborprice = invoicetotallaborprice + linetotal;
            var j = i + 1;
            savedinvoice = savedinvoice + '<div>'
            savedinvoice = savedinvoice + '<h3>' + jsonData[i].desc + '</h3>';
            savedinvoice = savedinvoice + '<h3>By: ' + jsonData[i].techname + '</h3>';
            savedinvoice = savedinvoice + '</div>';
            savedinvoice = savedinvoice + '<div>';
            savedinvoice = savedinvoice + '<h3>' + jsonData[i].hours + ' hours @ $' + jsonData[i].hourprice + '</h3>';
            savedinvoice = savedinvoice + '<h3>$' + linetotal + '</h3>';
            savedinvoice = savedinvoice + '</div>';
         
        }

        invoicegrandtotal = invoicegrandtotal + invoicetotallaborprice;
        invoicegrandtotal = Math.round(invoicegrandtotal);
        savedinvoice = savedinvoice + '</div>';
        savedinvoice = savedinvoice + '</div>';
        savedinvoice = savedinvoice + '<div class="one-col-grid margin5 invoice-border">'
        savedinvoice = savedinvoice + '<div><h3>Parts Total $' + invoicetotalpartprice + ' </h3>';
        savedinvoice = savedinvoice + '<h3>Labor Total $' + invoicetotallaborprice + ' </h3>';
        savedinvoice = savedinvoice + '<h3>Total $' + invoicegrandtotal + ' </h3></div>';
        savedinvoice = savedinvoice + '</div>';

        loadattachedtermslistforsave();
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadlaborcode === 0) {
           loadlaborlistgarageforsave();
        }
    })
    .always(function( xhr, status ) {
        
    });

};



var loadattachedtermslistforsavecode = 0;
function loadattachedtermslistforsave() {
    var plate = $('#theplate').val();
    var invoiceid = $('#invoiceid').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/attached/terms/invoice",
        data: {
            plate: plate,
            invoiceid: invoiceid
        }
    })
    .done(function( data ) {
        loadattachedtermslistforsavecode = 1;

        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        
        for (var i = 0; i < jsonData.length; ++i) {
            savedterms = savedterms + '<div class="one-col-grid margin5 invoice-border">'
            savedterms = savedterms + '<h3>' + jsonData[i].termstitle + '</h3>';
            savedterms = savedterms + '<p>' + jsonData[i].termstext + '</p>';
            savedterms = savedterms + '</div>';
        }
        commitinvoiceforsave();
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadattachedtermslistforsavecode === 0) {
            loadattachedtermslistforsave();
        }
    })
    .always(function( xhr, status ) {

    });

};


var loadwaiverlistforsavecode = 0;
function loadwaiverlistforsave() {
    var plate = $('#theplate').val();
    var invoiceid = $('#invoiceid').val();
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/view/waiver/approval",
        data: {
            plate: plate
        }
    })
    .done(function( data ) {
        loadwaiverlistforsavecode = 1;

        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);

        savedwaiverlist = savedwaiverlist + '<div class="one-col-grid"><div class="margin5">';                
        for (var i = 0; i < jsonData.length; ++i) {
            savedwaiverlist = savedwaiverlist + '<p>' + jsonData[i].waivertext + '</p>';
            savedwaiverlist = savedwaiverlist + '<h4>Response: ' + jsonData[i].approvalstatus + '</h4>';
            savedwaiverlist = savedwaiverlist + '<h4>Signed: ' + jsonData[i].approvalsignature + '</h4>';
            savedwaiverlist = savedwaiverlist + '<h4>At: ' + jsonData[i].nicetime + ' UTC</h4>';
        }
        savedwaiverlist = savedwaiverlist + '</div></div>'; 
        commitinvoiceforsave();
    })
    .fail(function( xhr, status, errorThrown ) {
        if (loadwaiverlistforsavecode === 0) {
            loadwaiverlistforsave();
        }
    })
    .always(function( xhr, status ) {

    });

};



var commitinvoicecode = 0;
function commitinvoiceforsave() {
    var plate = $('#theplate').val();
    var invoiceid = $('#invoiceid').val();
    savedinvoice = savedinvoice + savedexpectedcompletion + savedterms + savedapproval + '</body></html>';
    $.ajax({
        type: "POST",
        url: "https://chromemufflerbearing.com/save/invoice/html",
        data: {
            plate: plate,
            invoiceid: invoiceid,
            sectionfilename: 'invoice',
            sectiontext: savedinvoice
        }
    })
    .done(function( data ) {
        commitinvoicecode = 1;

        var jsonStr = JSON.stringify(data);
        var jsonData = JSON.parse(jsonStr);
        
        for (var i = 0; i < jsonData.length; ++i) {     

        }
    })
    .fail(function( xhr, status, errorThrown ) {
        if (commitinvoicecode === 0) {
            commitinvoiceforsave();
        }
    })
    .always(function( xhr, status ) {

    });

};


