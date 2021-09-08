var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken');
var config = require('./config');
var md5 = require('md5');
var moment = require('moment');

var http = require('http').Server(app);
var methodOverride = require('method-override'); 
var fs = require("fs");
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var apiRoutes = express.Router();
var cusRoutes = express.Router();

// GARAGESAASCODEHERE Sendgrid credentials
var sendgrid_username = 'sendg_user';
var sendgrid_password = 'sendg_pass';
var sendgrid = require('sendgrid')(sendgrid_username, sendgrid_password);
//GARAGESAASCODEHERE valid twilio number, admin phone number (to recieve text alerts) and email address
var valid_twilio_number = 'twil_numb';
var admin_phone = 'twil_admin_numb';
var admin_email_address = 'admin_email';
var port = process.env.PORT || 3000; 
// GARAGESAASCODEHERE Stripe server key
var stripe = require("stripe")("str_server");
// GARAGESAASCODEHERE Stripe public key
var stripe_public = 'str_public';
//GARAGESAASCODEHERE twilio account info
var accountSid = 'twil_sid'; // Your Account SID from www.twilio.com/console
var authToken = 'twil_auth';   // Your Auth Token from www.twilio.com/console

var FiveoUser = require('./app/models/fiveouser'); 
var fiveoStatusUpdate = require('./app/models/fiveostatusupdate'); 
var fiveoStatusComment = require('./app/models/fiveostatuscomment'); 
var blogImageListCMB = require('./app/models/blogimagelistcmb'); 
var cmbWebPage = require('./app/models/cmbwebpage'); 
var cmbWebSection = require('./app/models/cmbwebsection'); 


/* dvi */
var jkwPlateInfo = require('./app/models/jkwplateinfo'); 
var jkwCarInfo = require('./app/models/jkwcarinfo'); 
var jkwAlertInfo = require('./app/models/jkwalertinfo'); 
var jkwRepairReason = require('./app/models/jkwrepairreason'); 
var jkwRepairSchedule = require('./app/models/jkwrepairschedule'); 
var jkwRepairStatus = require('./app/models/jkwrepairstatus'); 
var jkwRepairPart = require('./app/models/jkwrepairpart'); 
var jkwRepairHour = require('./app/models/jkwrepairhour');
var jkwRepairInvoice = require('./app/models/jkwrepairinvoice'); 
var jkwRepairApproval = require('./app/models/jkwrepairapproval'); 
var jkwRepairCheckin = require('./app/models/jkwrepaircheckin'); 
var jkwRepairChat = require('./app/models/jkwrepairchat'); 
var jkwRepairDoneDate = require('./app/models/jkwrepairdonedate'); 
var jkwRepairWaiver = require('./app/models/jkwrepairwaiver'); 
var jkwRepairWaiverList = require('./app/models/jkwrepairwaiverlist'); 
var jkwRepairTerms = require('./app/models/jkwrepairterms');
var jkwRepairTermsList = require('./app/models/jkwrepairtermslist');
var jkwInspectionReport = require('./app/models/jkwinspectionreport'); 
var jkwInspectionPart = require('./app/models/jkwinspectionpart');
var jkwInspectionPartList = require('./app/models/jkwinspectionpartlist');



mongoose.connect(config.database); 
app.set('garagesaassecret', config.secret); // secret variable
var request = require('request');

app.use(express.static(__dirname + '/app/public')); 				// set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/json' })); // parse application/vnd.api+json as json
app.use(methodOverride());



var twilio = require('twilio');
var client = new twilio(accountSid, authToken);


var multer  = require('multer');
var done = false;
var savefile;
var jkw = '';
var savedas = '';
	app.use(multer({ dest: './app/public/uploads/',
		rename: function (fieldname, filename) {
			savefile = filename;
			
			filename = filename.replace(/\s+/g, '-');
			filename = filename.replace(/\(/g, "").replace(/\)/g,"");			
			filename = jkw + filename;
			savedas = filename;
			return filename;
		},
		onFileUploadStart: function (file) {
		  console.log(file.originalname + ' is starting ...')
		},
		onFileUploadComplete: function (file) {
			console.log(file.fieldname + ' up to  ' + file.path)
			done = true;
			res.send('upload complete');
		}
	}));
app.post('/file-upload', function(req, res){
	fs.readFile(req.files.displayImage.path, function (err, data) {
		var newPath = __dirname + "/app/public/uploads/abc" + req.files.displayImage.name;
		fs.writeFile(newPath, data, function (err) {
		  res.redirect("back");
		});
	  });
});
app.get('/file-upload', function(req, res){
	fs.readFile(req.files.displayImage.path, function (err, data) {
		var newPath = __dirname + "/app/public/uploads/abc" + req.files.displayImage.name;
		fs.writeFile(newPath, data, function (err) {
		  res.redirect("back");
		});
	  });
});

function sendText(sendto, message) {
	jkwAlertInfo.findOne({plate: sendto }, function(err, user) { 
		if (err) return console.error(err);
		var alerttype = user.alerttype;
		var sendmessage = '[' + alerttype + '] ' + message
		client.messages.create({
			body: sendmessage,
			to: '+1' + sendto,  // Text this number
			from: '+1' + valid_twilio_number // enter a valid Twilio number GARAGESAASCODEHERE
		})
		.then((message) => console.log(message.sid));
		res.send(alerttype);	
	});

}

function sendEmailPaymentConfirm(namelow) {

	var drip = fs.readFileSync('./app/public/emailtemplate/payment_thanks.html');
	var email = new sendgrid.Email({
	    to: namelow,
	    from: admin_email_address, // GARAGESAASCODEHERE your email address
		subject: '',
		html: drip,
		text: 'thank you'
	});
	sendgrid.send(email, function(err, json){
    	if(err) { return console.error(err); }
		sendEmailPaymentConfirmSelf(namelow)
	});
}






app.post('/customer/image/move', function(req, res) {
	var fs = require("fs");
	var moment = require('moment');
	var userid = req.body.plate;
	var savefilename = req.body.imageurl;
	var postid = req.body.postid;
	var mkdirp = require('mkdirp');
	var timenow = moment().format('YYYYMMDDkkmmss');
	var savefile = timenow + savefilename;
	var savedas = timenow + savefilename;
	mkdirp('./app/public/uploads/' + userid, function(err){
		if (err) console.error(err);
		else console.log('pow!');
		fs.rename('./app/public/uploads/' + savefilename, './app/public/uploads/'+userid+'/'+savedas, function (err) {
			if (err) throw err;
			res.send(savedas);
		});	

	});
});


app.post('/resize/image', function(req, res){
	var imagename = req.body.imagename;
	var Jimp = require('jimp');
	Jimp.read('./app/public/uploads/' + imagename)
	.then(lenna => {
	  return lenna
		.resize(Jimp.AUTO, 600) // resize
		.quality(60) // set JPEG quality
		.write('./app/public/uploads/aa' + imagename); // save
	})
	.catch(err => {
	  console.error(err);
	});
});



app.post('/save/invoice/html', function(req, res) {  
		var fs = require("fs");
		var invoiceid = req.body.invoiceid;
		var sectionfilename = req.body.sectionfilename;
		var savedfilename = invoiceid + '_' + sectionfilename;
		var invoicetop = fs.readFileSync('./app/public/invoice/invoice_top.html');
		var plate = req.body.plate;
		var sectiontext = req.body.sectiontext;
		var fullinvoice = invoicetop + sectiontext;
		var mkdirp = require('mkdirp');
		mkdirp('./app/public/invoice/' + plate, function(err) {
			if (err) console.error(err);
			else console.log('pow!');
			fs.writeFile('./app/public/invoice/' + plate + '/' + savedfilename + '.html', fullinvoice, function(err) {
				if(err) {
					console.log(err);
					res.json({ success: true, savefilename: 'times', saved: 'error' });
				} else {
					console.log("The file was saved!");
					res.json({ success: true, savefilename: 'times', saved: 'yes', plate: plate });
				}
			});
		});
});

app.post('/save/html/as/pdf', function(req, res){

	var sectionfilename = req.body.sectionfilename;
	var plate = req.body.plate;

	var fs = require('fs');
	var pdf = require('html-pdf');
	var html = fs.readFileSync('./app/public/invoice/'+plate+'/'+sectionfilename+'.html', 'utf8');
	var options = {  };
	
	pdf.create(html, options).toFile('./app/public/invoice/'+plate+'/'+sectionfilename+'.pdf', function(err, res2) {
	if (err) return console.log(err);
		console.log(res2); 
		res.send('done');
	});


});

app.post('/load/invoice/html', function(req, res) { 
	var fs = require("fs");
	var sectionfilename = req.body.sectionfilename;
	var plate = req.body.plate;

	var selectedSection = fs.readFileSync('./app/public/invoice/' + plate + '/' + sectionfilename + '.html');
	res.send(selectedSection);

});
app.post('/save/invoice/pdf', function(req, res) { 
    var grandtotal = 0;
    var totalpartprice = 0;
	var totallaborprice = 0;
	
	const PDFDocument = require('pdfkit');
		const doc = new PDFDocument({
			size: 'LETTER', // See other page sizes here: https://github.com/devongovett/pdfkit/blob/d95b826475dd325fb29ef007a9c1bf7a527e9808/lib/page.coffee#L69
			info: {
			  Title: 'Tile of File Here',
			  Author: 'Some Author',
			}
		  });

		
		// Pipe its output somewhere, like to a file or HTTP response
		// See below for browser usage
		doc.pipe(fs.createWriteStream('./app/public/'+req.body.invoiceid+'.pdf'));
		// Embed a font, set the font size, and render some text
		// Add another page
		doc.addPage({
			margin: 50});


	jkwRepairInvoice.find({ plate: req.body.plate, invoiceid: req.body.invoiceid }, function(err, user) { 
		if (err) return console.error(err);
	
		var jsonStr = JSON.stringify(user);
		var jsonDataCrank = JSON.parse(jsonStr);
		for (var i = 0; i < jsonDataCrank.length; ++i) {
			const lorem = 'Vehicle: ' + jsonDataCrank[i].invoiceyearmake + ' Plate: ' + jsonDataCrank[i].invoiceregistrationnumber;
			doc.fontSize(18);
				doc.text(` ${lorem}`, {
					align: 'left'
				}
			);

			const customername = 'Name: ' + jsonDataCrank[i].invoicecustomername;
			doc.fontSize(18);
				doc.text(` ${customername}`, {
					align: 'left'
				}
			);
			doc.moveDown();			
			
		}		
	});
	doc.moveDown();
	doc.moveDown();
	jkwRepairPart.find({ plate: req.body.plate, invoiceid: req.body.invoiceid }, function(err2, user2) { 
		if (err2) return console.error(err2);

		var jsonStr2 = JSON.stringify(user2);
		var jsonDataInvoiceParts = JSON.parse(jsonStr2);
		for (var i = 0; i < jsonDataInvoiceParts.length; ++i) {

			var theprice = parseInt(jsonDataInvoiceParts[i].partprice);
			var thecount = parseInt(jsonDataInvoiceParts[i].partcount);
			var thelinetotal = theprice * thecount;
			totalpartprice = totalpartprice + thelinetotal;
			var j = i + 1;
			const partdesc = 'Part Description: ' + jsonDataInvoiceParts[i].part + ' ' + thelinetotal;
			doc.fontSize(18);
				doc.text(` ${partdesc}`, {
					align: 'left'
				}
			);
		}

		grandtotal = grandtotal + totalpartprice;
		grandtotal = Math.round(grandtotal);

	});

	doc.moveDown();
	jkwRepairHour.find({ plate: req.body.plate, invoiceid: req.body.invoiceid }, function(err2, user2) { 
		if (err2) return console.error(err2);

		var jsonStr2 = JSON.stringify(user2);
		var jsonDataInvoiceLabor = JSON.parse(jsonStr2);
		for (var i = 0; i < jsonDataInvoiceLabor.length; ++i) {


			var theprice = parseFloat(jsonDataInvoiceLabor[i].hourprice);
			var thehours = parseFloat(jsonDataInvoiceLabor[i].hours);
			var linetotal = theprice * thehours;
			totallaborprice = totallaborprice + linetotal;
			var j = i + 1;

			const workdesc = 'Work Description: ' + jsonDataInvoiceLabor[i].desc;
			doc.fontSize(18);
				doc.text(` ${workdesc}`, {
					align: 'left'
				}
			);
		}

		grandtotal = grandtotal + totallaborprice;
		grandtotal = Math.round(grandtotal);
		
		const theinvoicetotal = 'Total: ' + grandtotal + ' Labor: ' + totallaborprice + ' Parts ' + totalpartprice;
		doc.fontSize(18);
			doc.text(` ${theinvoicetotal}`, {
				align: 'left'
			}
		);

		doc.end();

		res.send('ok');

	});

	



});

/*
	here to support support chat
*/



apiRoutes.post('/moto/move/blog/image', function(req, res){
	var fs = require("fs");
	var moment = require('moment');
	var userid = req.body.userid;
	var savefilename = req.body.imageurl;
	var postid = req.body.postid;
	var mkdirp = require('mkdirp');
	var timenow = moment().format('YYYYMMDDkkmmss');
	var savedas = timenow + savefilename;
	mkdirp('./app/public/uploads/' + userid, function(err){
		if (err) console.error(err);
		else console.log('pow!');
		fs.rename('./app/public/uploads/' + savefilename, './app/public/uploads/'+userid+'/'+savedas, function (err) {
			if (err) throw err;
			res.send(savedas);
		});	

	});
});

apiRoutes.post('/moto/check/blog/image/exists', function(req, res){

	const fs = require('fs')
	var savefilename = req.body.imageurl;
	const path = './app/public/uploads/' + savefilename;
	fs.access(path, fs.F_OK, (err) => {
		if (err) {
			res.send('no');
			console.error(err)
			return
		}
		res.send('yes');
	})

});


app.post('/view/image/list', function(req, res) { 
	blogImageListCMB.find({ }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});


function hashtag(text){
    var repl = text.replace(/#(\w+)/g, "<a href='#'>#$1</a>  ");
    return repl;
}
function paragraph(text){
    return repl;
}


app.post('/view/checkin/status', function(req, res) {

	jkwRepairCheckin.find({plate:req.body.plate }, function(err, user) {
		if (err) return console.error(err);
		res.send(user);
	});
});

app.post('/edit/status/update', function(req, res) {
	var moment = require('moment');
	var timestamp = moment().format('YYYYMMDDkkmmss');
	var timestampnice = moment().format('YYYY-MM-DD kk:mm');
	fiveoStatusUpdate.findOne({ postid: req.body.postid }, function(err, p) {
		if (!p)
			return console.error(err);
		else {
			p.status = req.body.status;
			timestamp = timestamp;
			timestampnice = timestampnice;
			p.save(function(err) {
				if (err)
					res.send('no word');
				else
					console.log('success');
					res.json({ success: true, status: req.body.status });
			});
		}
	});
});


app.post('/save/status/upvote', function(req, res) {
		fiveoStatusUpdate.findOne({postid: req.body.postid}, function(err, p) {
			if (!p)
				return console.error(err);
			else {
				var currentUpvotes = parseInt(p.upvote) + 1;
				p.upvote = currentUpvotes;
				p.save(function(err) {
					if (err)
						res.send('no word');
					else
						console.log('success');
						res.json({ success: true, upvote: currentUpvotes });
				});
			}
		});
});






app.post('/move/blog/image2', function(req, res){
	var fs = require("fs");
	var savefilename = req.body.savefilename;
	fs.rename('./uploads/' + savefilename, './blog/'+savefilename, function (err) {
		if (err) throw err;
		console.log('Move complete.');
		res.send('complete');
	});	

});



const MessagingResponse = require('twilio').twiml.MessagingResponse;
app.post('/sms', (req, res) => {
/*	const twiml = new MessagingResponse();
  
	twiml.message('The Robots are coming! Head for the hills!');
  
	res.writeHead(200, {'Content-Type': 'text/xml'});
	res.end(twiml.toString());*/

	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
	var rightnowdate = new Date();
	var millinow = rightnowdate.getTime();

    

		const twiml = new MessagingResponse();
		var sentfrom = req.body.From;
		var actualnumber = sentfrom.replace("+1", "");
		
		/*if (req.body.Body == 'hello') {
			var sentfrom = req.body.From;
			var actualnumber = sentfrom.replace("+1", "");
		  	twiml.message('Hi! ' + actualnumber);
		} else if (req.body.Body == 'bye') {
		  twiml.message('Goodbye');
		} else {*/
		

		  var carsave = new jkwRepairChat({
            plate: actualnumber,
			message: req.body.Body,
			sentby: actualnumber,
			nicetime: datetimenow,
            timestamp: millinow
			});
			carsave.save(function(err) {
					if (err) throw err;
					console.log('Vehicle Saved');
					/*twiml.message(
						'No Body param match, Twilio sends this in the request to your server.'
					);*/
					//res.json({ success: true, plate: req.body.plate });
			});

	//	}
	  
		res.writeHead(200, { 'Content-Type': 'text/xml' });
		res.end(twiml.toString());

  });

app.get('/send', function(req, res) {

		client.messages.create({
			body: 'Hello from Node',
			to: '+1' + admin_phone,  // Text this number GARAGESAASCODEHERE
			from: '+1' + valid_twilio_number // From a valid Twilio number
		})
		.then((message) => console.log(message.sid));
		res.json({success: 'true'});

});

app.get('/', function(req, res) {
	res.sendfile('./app/public/index.html');
});

app.get('/skeleton', function(req, res) { //used in service worker
	res.sendfile('./app/public/index.html'); 
});

app.get('/skeletonsigned', function(req, res) { // used in service worker
	res.sendfile('./app/public/index.html');
});


app.get('/admin', function(req, res) { // dvi
	res.sendfile('./app/public/index-garage.html');
});

app.get('/paybill/:amount/:invoiceid/:plate', function(req, res) { //dvi
	var htmloutput = fs.readFileSync('./app/public/client/client-payment-top.html');

		var paymentform = '';
		paymentform = paymentform + '<form action="/ridepay" method="POST">';
		paymentform = paymentform + '<script ';
		paymentform = paymentform + 'src="https://checkout.stripe.com/checkout.js" class="stripe-button" '; 
		// GARAGESAASCODEHERE stripe public key
		paymentform = paymentform + 'data-key="'+stripe_public+'"';
		paymentform = paymentform + 'data-amount="'+req.params.amount+'" ';
		paymentform = paymentform + 'data-name="{Your Garage}" ';
		paymentform = paymentform + 'data-description="Automotive Repair" ';
		paymentform = paymentform + 'data-image="https://stripe.com/img/documentation/checkout/marketplace.png" ';
		paymentform = paymentform + 'data-locale="auto" ';
		paymentform = paymentform + 'data-zip-code="true"> ';
		paymentform = paymentform + '</script>';
		paymentform = paymentform + '<input type="hidden" name="amount" id="amount" value="'+req.params.amount+'" />';		
		paymentform = paymentform + '<input type="hidden" name="invoiceid" id="invoiceid" value="'+req.params.invoiceid+'" />';		
		paymentform = paymentform + '<input type="hidden" name="theplate" id="theplate" value="'+req.params.plate+'" />';	
		paymentform = paymentform + '<input type="hidden" name="email" id="email" value="" />';	
		paymentform = paymentform + '</form>';
		htmloutput = htmloutput + paymentform;
		var htmlbottom = fs.readFileSync('./app/public/client/client-payment-bottom.html');
		htmloutput = htmloutput + htmlbottom;
		htmloutput = htmloutput + '</body>';
		res.writeHead(200, {
			'Content-Type': 'text/html',
			'Content-Length': htmloutput.length,
			'Expires': new Date().toUTCString()
		});
		res.end(htmloutput);
});
app.post('/ridepay', function(req, res) { 

	var token = req.body.stripeToken; // Using Express
	var invoiceid = req.body.invoiceid;
	var plate = req.body.theplate;
	stripe.charges.create({
		amount: req.body.amount,
		currency: "usd",
		source: token,
		description: "Charge for: " + plate + " invoiceid " + invoiceid,
		receipt_email: admin_email_address, // GARAGESAASCODEHERE your email address for a log of payments
		metadata: {'order_id': invoiceid }
	}).then(function(charge) {
		console.log("Charge created");
		jkwRepairInvoice.findOne({invoiceid: invoiceid}, function(err, p) {
			if (!p) {
				return console.error(err);
			} else {
				p.invoicestatus = 'paid';
				p.save(function(err) {
					if (err) {
	
					} else {
						console.log('success')
						res.sendfile('./app/public/index.html');
						//GARAGESAASCODEHERE enter your phone number for text receipt
						sendText(admin_phone, 'payment by' + plate +' $' + req.body.amount + " id: " + invoiceid);
						sendEmailPaymentConfirm(plate);
					}
				});
			}
		});

	}, function(err) {
		console.log(err);
		res.send('error! ' + err);
	});

});
/* digital vehicle inspection */


/*
new dvi begin

*/

app.get('/c/home/:plate', function(req, res) {
	var moment = require('moment');
	var htmloutput = fs.readFileSync('./app/public/client/client-index.html');

	jkwPlateInfo.findOne({ plate: req.params.plate }, function(err, user) { 
		if (err) {
			var theplate = user.plate;
			var thevehicleid = user.vehicleid;
			htmloutput = htmloutput + '</body>';
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Content-Length': htmloutput.length,
				'Expires': new Date().toUTCString()
			});
			res.end(htmloutput);
			return;
		} else {
			if (!user) {
				var datetimenow = moment().format('YYYY-MM-DD kk:mm');
				var vehicleid = moment().format('YYYYMMDDkkmm');
				var carsave = new jkwPlateInfo({
					plate: req.body.plate,
					vehicleid: vehicleid,
					timestamp: datetimenow
				}); 
				carsave.save(function(err) {
						if (err) throw err;
						console.log('Vehicle Saved');
						htmloutput = htmloutput + '<input type="hidden" name="customer" id="customer" value="customer" />';
						htmloutput = htmloutput + '<input type="hidden" name="inspectionid" id="inspectionid" value="0" />';
						htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="0" />';
						htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+vehicleid+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+req.params.plate+'" />';
						htmloutput = htmloutput + '</body>';
						res.writeHead(200, {
							'Content-Type': 'text/html',
							'Content-Length': htmloutput.length,
							'Expires': new Date().toUTCString()
						});
						res.end(htmloutput);
				});

			} else {
				var theplate = user.plate;
				var thevehicleid = user.vehicleid;
				htmloutput = htmloutput + '<input type="hidden" name="inspectionid" id="inspectionid" value="0" />';
				htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="0" />';
				htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+thevehicleid+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+theplate+'" />';
				htmloutput = htmloutput + '</body>';
				res.writeHead(200, {
					'Content-Type': 'text/html',
					'Content-Length': htmloutput.length,
					'Expires': new Date().toUTCString()
				});
				res.end(htmloutput);
			}
		}
	});
});

app.get('/c/message/:plate', function(req, res) {
	var moment = require('moment');
	var htmloutput = fs.readFileSync('./app/public/client/client-message.html');

	jkwPlateInfo.findOne({ plate: req.params.plate }, function(err, user) { 
		if (err) {
			var theplate = user.plate;
			var thevehicleid = user.vehicleid;
			htmloutput = htmloutput + '</body>';
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Content-Length': htmloutput.length,
				'Expires': new Date().toUTCString()
			});
			res.end(htmloutput);
			return;
		} else {
			if (!user) {
				var datetimenow = moment().format('YYYY-MM-DD kk:mm');
				var vehicleid = moment().format('YYYYMMDDkkmm');
				var carsave = new jkwPlateInfo({
					plate: req.body.plate,
					vehicleid: vehicleid,
					timestamp: datetimenow
				}); 
				carsave.save(function(err) {
						if (err) throw err;
						console.log('Vehicle Saved');
						htmloutput = htmloutput + '<input type="hidden" name="customer" id="customer" value="customer" />';
						htmloutput = htmloutput + '<input type="hidden" name="inspectionid" id="inspectionid" value="0" />';
						htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="0" />';
						htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+vehicleid+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+req.params.plate+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="username" id="username" value="name unknown" />';
						htmloutput = htmloutput + '</body>';
						res.writeHead(200, {
							'Content-Type': 'text/html',
							'Content-Length': htmloutput.length,
							'Expires': new Date().toUTCString()
						});
						res.end(htmloutput);
				});

			} else {
				var theplate = user.plate;
				var thevehicleid = user.vehicleid;
				htmloutput = htmloutput + '<input type="hidden" name="customer" id="customer" value="customer" />';
				htmloutput = htmloutput + '<input type="hidden" name="inspectionid" id="inspectionid" value="0" />';
				htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="0" />';
				htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+thevehicleid+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+theplate+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="username" id="username" value="name unknown" />';
				htmloutput = htmloutput + '</body>';
				res.writeHead(200, {
					'Content-Type': 'text/html',
					'Content-Length': htmloutput.length,
					'Expires': new Date().toUTCString()
				});
				res.end(htmloutput);
			}

		}
	});
});




app.get('/c/bill/:plate/:invoiceid', function(req, res) {
	var moment = require('moment');
	var htmloutput = fs.readFileSync('./app/public/client/client-invoice.html');

	jkwPlateInfo.findOne({ plate: req.params.plate }, function(err, user) { 
		if (err) {
			var theplate = user.plate;
			var thevehicleid = user.vehicleid;
			htmloutput = htmloutput + '</body>';
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Content-Length': htmloutput.length,
				'Expires': new Date().toUTCString()
			});
			res.end(htmloutput);
			return;
		} else 
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		var invoiceid = req.params.invoiceid;
		htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="'+invoiceid+'" />';
		htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+thevehicleid+'" />';
		htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+theplate+'" />';
		htmloutput = htmloutput + '</body>';
		res.writeHead(200, {
			'Content-Type': 'text/html',
			'Content-Length': htmloutput.length,
			'Expires': new Date().toUTCString()
		});
		res.end(htmloutput);
	
	});
});




app.get('/c/inspection/:plate/:inspectionid', function(req, res) {
	var moment = require('moment');
	var htmloutput = fs.readFileSync('./app/public/client/client-inspection.html');
	jkwPlateInfo.findOne({ plate: req.params.plate }, function(err, user) { 
		if (err) {
			var theplate = user.plate;
			var thevehicleid = user.vehicleid;
			htmloutput = htmloutput + '</body>';
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Content-Length': htmloutput.length,
				'Expires': new Date().toUTCString()
			});
			res.end(htmloutput);
			return;
		} else {
			if (!user) {
				var datetimenow = moment().format('YYYY-MM-DD kk:mm');
				var vehicleid = moment().format('YYYYMMDDkkmm');
				var carsave = new jkwPlateInfo({
					plate: req.body.plate,
					vehicleid: vehicleid,
					timestamp: datetimenow
				}); 
				carsave.save(function(err) {
						if (err) throw err;
						console.log('Vehicle Saved');
						htmloutput = htmloutput + '<input type="hidden" name="inspectionid" id="inspectionid" value="'+req.params.inspectionid+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="0" />';
						htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+vehicleid+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+req.params.plate+'" />';
						htmloutput = htmloutput + '</body>';
						res.writeHead(200, {
							'Content-Type': 'text/html',
							'Content-Length': htmloutput.length,
							'Expires': new Date().toUTCString()
						});
						res.end(htmloutput);
				});

			} else {
				var theplate = user.plate;
				var thevehicleid = user.vehicleid;
				htmloutput = htmloutput + '<input type="hidden" name="inspectionid" id="inspectionid" value="'+req.params.inspectionid+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="0" />';
				htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+thevehicleid+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+theplate+'" />';
				htmloutput = htmloutput + '</body>';
				res.writeHead(200, {
					'Content-Type': 'text/html',
					'Content-Length': htmloutput.length,
					'Expires': new Date().toUTCString()
				});
				res.end(htmloutput);
			}

		}
	});
});

app.post('/view/vehicle/', function(req, res) {
	var moment = require('moment');
	jkwCarInfo.find({ plate: req.body.plate }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		res.send(user);
	});
});
app.post('/view/status/', function(req, res) {
	var moment = require('moment');
	jkwRepairStatus.find({ plate: req.body.plate }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		res.send(user);
	}).sort({ timestamp: -1 });
});
app.post('/save/plate', function(req, res) {
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var vehicleid = moment().format('YYYYMMDDkkmm');

	
	jkwPlateInfo.findOne({
			plate: req.body.plate
		}, function(err, user) {
			if (err) throw err;
			if (!user) {
				var carsave = new jkwPlateInfo({
					plate: req.body.plate,
					vehicleid: vehicleid,
					timestamp: datetimenow
				}); 
				carsave.save(function(err) {
						if (err) throw err;
						console.log('Vehicle Saved');
						res.json({ success: 'saved', plate: req.body.plate });
				});

			} else {

				res.json({ success: 'found', plate: req.body.plate });
			} 
		}); 

}); 


app.post('/edit/plate/info', function(req, res) {
	jkwPlateInfo.findOne({plate: req.body.plate}, function(err, p) {
		if (!p) {
			return console.error(err);
		} else {
			p.vehicleid = '0001234456';
			p.save(function(err) {
			if (err)
				res.send('no word');
			else
				console.log('success')
				res.json({ success: true, plate: req.body.plate });
			});
		}
	});
});


app.post('/save/vehicle/info', function(req, res) {
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmm');
    var carsave = new jkwCarInfo({
            plate: req.body.plate,
			vehicleid: req.body.vehicleid,
			year: req.body.year,
			make: req.body.make,
			model: req.body.model,
			vin: req.body.vin,
			timestamp: timestamp,
			nicetime: datetimenow
    });
    carsave.save(function(err) {
            if (err) throw err;
            console.log('Vehicle Saved');
			res.json({ success: true, plate: req.body.plate, vehicleid: req.body.vehicleid });
    });
});

app.post('/edit/vehicle/info', function(req, res) {
	jkwCarInfo.findOne({plate: req.body.plate}, function(err, p) {
		if (!p) {
			var datetimenow = moment().format('YYYY-MM-DD kk:mm');
			var carsave = new jkwCarInfo({
					plate: req.body.plate,
					year: req.body.year,
					make: req.body.make,
					model: req.body.model,
					vin: req.body.vin,
					timestamp: datetimenow
			});
			carsave.save(function(err) {
					if (err) throw err;
					console.log('Vehicle Saved');
					client.messages.create({
						body: 'License Plate: ' + req.body.plate + ' just started signing up ',
						to: '+1' + admin_phone,  // Text this number GARAGESAASCODEHERE this is for alerts so you can be notified when someone signs up should be your phone number
						from: '+1' + valid_twilio_number // From a valid Twilio number
					})
					.then((message) => console.log(message.sid));
					res.json({ success: true, plate: req.body.plate, vehicleid: req.body.vehicleid });
			});
			return console.error(err);
		} else {
			p.year = req.body.year;
			p.make = req.body.make;
			p.model = req.body.model;
			p.vin = req.body.vin;
			p.save(function(err) {
				if (err) {

				} else {
					console.log('success')
					res.json({ success: true, plate: req.body.plate });
				}
			});
		}
	});
});

app.post('/view/alert/info/', function(req, res) {
	var moment = require('moment');
	jkwAlertInfo.find({ plate: req.body.plate }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		res.send(user);
	});
});

app.post('/edit/contact/info', function(req, res) {
	var nicetime = moment().format('hh:mm a MM.DD.YYYY');
	jkwAlertInfo.findOne({plate: req.body.plate}, function(err, p) {
		if (!p) {
			var datetimenow = moment().format('YYYYMMDDkkmm');
			var carsave = new jkwAlertInfo({
					plate: req.body.plate,
					name: req.body.name,
					phone: req.body.phone,
					email: req.body.email,
					alerttype: 'all',
					nicetime: nicetime,
					timestamp: datetimenow
			});
			carsave.save(function(err) {
					if (err) throw err;
					console.log('Vehicle Saved');
					client.messages.create({
						body: 'License Plate: ' + req.body.plate + ' just finished signing up ',
						to: '+1' + admin_phone,  // Text this number GARAGESAASCODEHERE
						from: '+1' + valid_twilio_number // From a valid Twilio number
					})
					.then((message) => console.log(message.sid));
					//res.json({success: 'true'});

					var welcomesave = new jkwRepairStatus({
							plate: req.body.plate,
							vehicleid: req.body.vehicleid,
							//GARAGESAASCODEHERE should be your welcome message
							status: "Welcome to {Your Garage}, this will be your welcome message where you communicate with your customers what to expect next....",
							statusimg: '',
							statustype: 'text',
							nicetime: nicetime,
							timestamp: datetimenow
					});
					welcomesave.save(function(err) {
							if (err) throw err;
							console.log('Vehicle Saved');
							res.json({ success: true, plate: req.body.plate, vehicleid: req.body.vehicleid });
					});
			
					
			});			
			return;
		} else {
			p.name = req.body.name;
			p.phone = req.body.phone;
			p.email = req.body.email;
			p.alerttype = req.body.alerttype;

			p.save(function(err) {
				if (err) {

				} else {
					console.log('success')
					res.json({ success: true, plate: req.body.plate });
				}
			});
		}
	});
});

app.post('/save/repair/reason', function(req,res){

	jkwRepairReason.findOne({plate: req.body.plate}, function(err, p) {
		if (!p) {
			var datetimenow = moment().format('YYYY-MM-DD kk:mm');
			var carsave = new jkwRepairReason({
					plate: req.body.plate,
					vehicleid: req.body.vehicleid,
					whatswrong: req.body.whatswrong,
					timestamp: datetimenow
			});
			carsave.save(function(err) {
					if (err) throw err;
					console.log('Vehicle Saved');
					res.json({ success: true, plate: req.body.plate });
			});
			return console.error(err);
		} else {
			p.whatswrong = req.body.whatswrong;
			p.save(function(err) {
				if (err) {

				} else {
					console.log('success')
					res.json({ success: true, plate: req.body.plate });
				}
			});
		}
	});
});

app.post('/view/repair/reason', function(req, res) {
	var moment = require('moment');
	jkwRepairReason.find({ plate: req.body.plate }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		res.send(user);
	});
});


app.post('/save/repair/schedule', function(req,res){

	jkwRepairSchedule.findOne({plate: req.body.plate}, function(err, p) {
		if (!p) {
			var datetimenow = moment().format('YYYY-MM-DD kk:mm');
			var carsave = new jkwRepairSchedule({
					plate: req.body.plate,
					vehicleid: req.body.vehicleid,
					appointment: req.body.appointment,
					appointmenttime: req.body.appointmenttime,
					timestamp: datetimenow
			});
			carsave.save(function(err) {
					if (err) throw err;
					console.log('Vehicle Saved');
					res.json({ success: true, plate: req.body.plate, appointment: req.body.appointment });
			});
			return console.error(err);
		} else {
			p.appointment = req.body.appointment;
			p.save(function(err) {
				if (err) {

				} else {
					console.log('success')
					res.json({ success: true, plate: req.body.plate, appointment: req.body.appointment });
				}
			});
		}
	});

});

app.post('/view/schedule', function(req, res) {
	var moment = require('moment');
	jkwRepairSchedule.find({ plate: req.body.plate }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		res.send(user);
	});
});

app.post('/save/chat/message', function(req, res) {
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
	var rightnowdate = new Date();
	var millinow = rightnowdate.getTime();

    var carsave = new jkwRepairChat({
            plate: req.body.plate,
			message: req.body.thechatmessage,
			sentby: req.body.sentby,
			nicetime: req.body.nicetime,
            timestamp: millinow
    });
    carsave.save(function(err) {
            if (err) throw err;
			console.log('Vehicle Saved');
			client.messages.create({
				body: 'CMB message ' + req.body.plate,
				to: '+1' + admin_phone,  // Text this number GARAGESAASCODEHERE your phone number for alerts
				from: '+1' + valid_twilio_number // From a valid Twilio number
			})
			.then((message) => console.log(message.sid));
			res.json({ success: true, plate: req.body.plate });
    });
});

app.post('/view/message', function(req, res) {
	var moment = require('moment');
	jkwRepairChat.find({ plate: req.body.plate }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		res.send(user);
	}).sort({ timestamp: 1 });
});

app.post('/view/message/all', function(req, res) {
	var moment = require('moment');
	jkwRepairChat.find().distinct('plate', function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		res.send(user);
	}).sort({sectionorder: 1 });;	
});

app.post('/view/expected/date/list', function(req, res) {
	var moment = require('moment');
	jkwRepairDoneDate.find({plate: req.body.plate, invoiceid: req.body.invoiceid }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});

app.post('/view/attached/terms/invoice', function(req, res) {
	var moment = require('moment');
	jkwRepairTerms.find({ invoiceid: req.body.invoiceid, plate: req.body.plate }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});





app.post('/view/waiver/approval', function(req, res) {
//all waivers for customer
	jkwRepairWaiver.find({ plate: req.body.plate }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		res.send(user);
	});

});
app.post('/view/waiver/id/approval', function(req, res) {
	//waiver by id
	jkwRepairWaiver.find({ plate: req.body.plate, timestamp: req.body.timestamp }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		res.send(user);
	});
});

app.post('/sign/waiver/approval', function(req, res) {
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
	var vehicleid = req.body.vehicleid;
	var approvalstatus = req.body.approvalstatus;
	var approvalsignature = req.body.approvalsignature;
	var approvedvia = req.body.approvedvia;
	var approvalid = timestamp;
	var waiverid = req.body.waiverid; // actually timestamp from waiver request
	var rightnowdate = new Date();
	var timestampmillisecond = rightnowdate.getTime();
	var datetimestampfrommilli = moment.unix(timestampmillisecond/1000).format("DD MMM YYYY hh:mm a");
	jkwRepairWaiver.findOne({plate: req.body.plate, timestamp: waiverid}, function(err, p) {
		if (!p) {
			return console.error(err);
		} else {
			p.approvalstatus = approvalstatus;
			p.approvalid = approvalid;
			p.approvalsignature = approvalsignature;
			
			p.save(function(err) {
				if (err) {

				} else {
					console.log('success')
					jkwRepairWaiver.find({ plate: req.body.plate, waiverid: req.body.waiverid }, function(err, user) { 
						if (err) return console.error(err);
						var theplate = user.plate;
						var thevehicleid = user.vehicleid;
						res.send(user);
					});
		
				}
			});
		}
	});

});
app.post('/view/invoice/approval', function(req, res) {

	jkwRepairApproval.find({ plate: req.body.plate, invoiceid: req.body.invoiceid }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		res.send(user);
	});

});

app.post('/save/invoice/approval', function(req, res) {
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
	var invoiceid = req.body.invoiceid;
	var vehicleid = req.body.vehicleid;
	var approvalstatus = req.body.approvalstatus;
	var approvalsignature = req.body.approvalsignature;
	var approvedvia = req.body.approvedvia;
	var approvalid = timestamp; 
	
	var rightnowdate = new Date();
	var timestampmillisecond = rightnowdate.getTime();
	var datetimestampfrommilli = moment.unix(timestampmillisecond/1000).format("DD MMM YYYY hh:mm a");

    var carsave = new jkwRepairApproval({
            plate: req.body.plate,
			vehicleid: vehicleid,
			invoiceid: invoiceid,
			approvalstatus: approvalstatus,
			approvalsignature: approvalsignature,
			approvedvia: approvedvia,
			approvalid: approvalid,
			timestamp: timestampmillisecond,
			nicetime: datetimestampfrommilli
    });
    carsave.save(function(err) {
            if (err) throw err;
			console.log('Vehicle Saved');
			
			jkwRepairInvoice.findOne({invoiceid: invoiceid}, function(err, p) {
				if (!p) {
					return console.error(err);
				} else {
					p.approvalstatus = approvalstatus;
					p.approvalid = approvalid;
					var donedate = p.expecteddate;
					p.save(function(err) {
						if (err) {
		
						} else {
							console.log('success')

							var repairdate = new jkwRepairDoneDate({
									plate:req.body.plate,
									vehicleid: vehicleid,
									invoiceid: invoiceid,
									donedate: donedate,
									timestamp: timestamp,
									nicetime: datetimenow
							});
							repairdate.save(function(err) {
								if (err) throw err;
								console.log('Vehicle Saved');
								jkwRepairApproval.find({ plate: req.body.plate, invoiceid: req.body.invoiceid }, function(err, user) { 
									if (err) return console.error(err);
									var theplate = user.plate;
									var thevehicleid = user.vehicleid;
									res.send(user);
								});
							});

							
				
						}
					});
				}
			});

			
    });
});

//
app.post('/view/inspection/part/', function(req, res) {
	//duplicate from api
	// the inspected parts as in the saved part condition
	// inspectionid is the inspection list
	// partid is the inspected part id from the parts list
	// this is the inspected part
	// the actual condition of the radiator water pump brake rotor or whatever inspected part is inspected
	jkwInspectionPart.find({ plate: req.body.plate, inspectionid: req.body.inspectionid }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		res.send(user);
	});
});


app.post('/view/repair/invoice/list', function(req, res) {
	var moment = require('moment');
	jkwRepairInvoice.find({ plate: req.body.plate }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});
app.post('/view/repair/invoice/single', function(req, res) {
	var moment = require('moment');
	jkwRepairInvoice.find({ plate: req.body.plate, invoiceid: req.body.invoiceid }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});



app.post('/view/repair/part', function(req, res) {
	var moment = require('moment');
	jkwRepairPart.find({ plate: req.body.plate, invoiceid: req.body.invoiceid }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		res.send(user);
	});
});


app.post('/view/repair/hour', function(req, res) {
	var moment = require('moment');
	jkwRepairHour.find({ plate: req.body.plate, invoiceid: req.body.invoiceid }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	});
});

app.post('/view/inspection/list/', function(req, res) {
	//view the list of inspection reports.
	//app and apiroutes
	var moment = require('moment');
	jkwInspectionReport.find({ plate: req.body.plate }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	});
});

/* digital vehicle inspection end */




app.post('/ridecreate', function(req, res) {
	// 1/26/17 used in app. rideplan
    var namein = req.body.email;
	var namelow = namein.toLowerCase();
	FiveoUser.findOne({
		email: namelow
	}, function(err, user) {
		if (err) {
            var pmd = md5(req.body.pw);
			//res.json({ success: false, message: 'User not found.', name: req.body.name });
			var datetimenow = moment().format('YYYYMMDDhhmmss');
			var reup = moment().format('YYYYMMDD');
			var gooduntil = moment().add(14, 'day').format('YYYYMMDD');
            var coolrider = new FiveoUser({
                name: req.body.name,
                password: pmd,
				myid: datetimenow,
                email: namelow,
				fireid: req.body.fireid,
                level: req.body.level,
				lastreup: reup,
				expires: gooduntil,
                admin: true
            });
            coolrider.save(function(err) {
                if (err) throw err;
                console.log('User saved successfully');
                //res.json({ success: true, message: 'created', name: req.body.name });
				 res.json({ 
					success: true, 
					user: user.name,
					message: 'success',
					myid: user.myid,
					fireid: user.fireid,
					email: user.email,
					level: user.level,
					name: user.name,
					lastreup: user.lastreup,
					expires: user.expires,
					token: token 
				});
				//savepayment(user.email);
				//savepaymenttrial(user.email);
				
			//	sendEmail("new user: " + user.email);
            });

			//throw err;
		} 
		if (!user) {
            var pmd = md5(req.body.pw);
			//res.json({ success: false, message: 'User not found.', name: req.body.name });
			var datetimenow = moment().format('YYYYMMDDhhmmss');
			var reup = moment().format('YYYYMMDD');
			var gooduntil = moment().add(14, 'day').format('YYYYMMDD');
            var coolrider = new FiveoUser({
                name: req.body.name,
                password: pmd,
				myid: datetimenow,
                email: namelow,
				fireid: req.body.fireid,
                level: req.body.level,
				lastreup: reup,
				expires: gooduntil,
                admin: true
            });
            coolrider.save(function(err) {
                if (err) throw err;
                console.log('User saved successfully');
                //res.json({ success: true, message: 'created', name: req.body.name });
				 res.json({ 
					success: true, 
					user: user.name,
					message: 'success',
					myid: user.myid,
					fireid: user.fireid,
					email: user.email,
					level: user.level,
					name: user.name,
					lastreup: user.lastreup,
					expires: user.expires,
					token: token 
				});
				//savepayment(user.email);
				//savepaymenttrial(user.email);
				
			//	sendEmail("new user: " + user.email);
            });
		} else if (user) {
		//	res.send("2");
			FiveoUser.findOne({
					email: namelow
				}, function(err, user) {
					if (err) throw err;
					if (!user) {
						res.send("2");
					} else if (user) {
						if (user.password != md5(req.body.pw)) {
							res.json({ success: false, message: 'Authentication failed. Wrong password / Email.', token: '0' });
						} else {
							var signaturetime = moment().format('MMDD');
							var sigtime = md5(signaturetime);
							var tas = md5('GARAGESAASCODEHERE');//GARAGESAASCODEHERE
							sigtime = sigtime + tas;
						
							var signature = md5(user.myid);
							var token = jwt.sign({
								data: signature,
								jkw: sigtime
							  }, app.get('garagesaassecret'), { expiresIn: 60 * 180 });

							var expiration = user.expires;
							var todaydate = moment().format('YYYYMMDD');
							var expireInt = parseInt(expiration, 10);
							var todayInt = parseInt(todaydate, 10);
							if (todayInt <= expireInt) {
								res.json({
									success: true, 
									user: user.name,
									fireid: user.fireid,
									email: user.email,
									message: 'success',
									myid: user.myid,
									level: user.level,
									lastreup: user.lastreup,
									expires: user.expires,
									token: token 
								});
							} else {
								res.json({
									success: false, 
									user: user.name,
									fireid: user.fireid,
									email: user.email,
									message: 'expired',
									myid: user.myid,
									level: user.level,
									lastreup: user.lastreup,
									expires: user.expires,
									token: token 
								});								
							}
							
						} 
					} 
				}); 
		}
	});
});


app.post('/resetpass', function(req, res) {
	var namein = req.body.email;
	var namelow = namein.toLowerCase();

	FiveoUser.findOne({email: namelow}, function(err, p) {
				if (!p)
					return console.error(err);
				else {
					var name = p.name;
					var pass = p.password;
					var theid = p.myid;
					var emailaddy = p.email;
					var datetimenow = moment().add(120, 'minutes').format('YYYYMMDDhhmmss');
					var link = 'https://chromemufflerbearing.com/newpass/' + theid + '/' + datetimenow;
					
					res.json({ success: true, message: 'Success!' });


				} 
		});   
}); 


app.post('/setpass', function(req, res) {
FiveoUser.findOne({myid: req.body.myid}, function(err, p) {
			if (!p)
				return console.error(err);
			else {
				
				var pmd = md5(req.body.pw);
				p.level = '2pac';
				p.password = pmd;
				p.save(function(err) {
				if (err)
					res.send('no word');
				else
					console.log('success');
					
					res.json({ success: true, email: req.body.myid });
				});
			}
	});
});



app.post('/rideauth', function(req, res) { 
	// 1/27/2017
	//this is auth for the android app
	// find the user
		// 		name: req.body.name,
		//		fireid: req.body.fireid,
	var namein = req.body.email;
	var namelow = namein.toLowerCase();

	FiveoUser.findOne({
		email: namelow
	}, function(err, user) {
		if (err) throw err;
		if (!user) {
			res.send("2");
		} else if (user) {
			if (user.email != namelow || user.password != md5(req.body.pw)) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.', token: '0' });
			} else {
				var signaturetime = moment().format('MMDD');
				var sigtime = md5(signaturetime);
				var tas = md5('GARAGESAASCODEHERE');
				sigtime = sigtime + tas;
			
				var signature = md5(user.myid);
				var token = jwt.sign({
					data: signature,
					jkw: sigtime
				  }, app.get('garagesaassecret'), { expiresIn: 60 * 13000 });

				var expiration = user.expires;
				var todaydate = moment().format('YYYYMMDD');
				var expireInt = parseInt(expiration, 10);
				var todayInt = parseInt(todaydate, 10);
						res.json({
							success: true, 
							user: user.name,
							fireid: user.fireid,
							email: user.email,
							message: 'success',
							myid: user.myid,
									level: user.level,
									lastreup: user.lastreup,
									expires: user.expires,
									token: token 
								});				
			} // end pw found
		} // end user found
	}); // end findone
}); // end authenticate


cusRoutes.use(function(req, res, next) {
	var fs = require("fs");
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, app.get('garagesaassecret'), function(err, decoded) {
			if (err) {
				var html = "";
			    html = fs.readFileSync('./app/public/index.html');
				res.writeHead(200, {
					'Content-Type': 'text/html',
					'Content-Length': html.length,
					'Expires': new Date().toUTCString()
				});
				return res.end(html);
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token
		// return an error
		// *********** really should be a page ********
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

cusRoutes.get('/home/', function(req, res){
	var token = req.param('token');
	var htmloutput = fs.readFileSync('./app/public/mechanic/mechanic-admin.html');
	htmloutput = htmloutput + '<input type="hidden" name="token" id="token" value="'+token+'" />';
	htmloutput = htmloutput + '<input type="hidden" name="username" id="username" value="{Your Garage}" />';
	htmloutput = htmloutput + '<input type="hidden" name="usernamegarage" id="usernamegarage" value="Your Garage" />';
	htmloutput = htmloutput + '</body></html>';
	res.writeHead(200, {
		'Content-Type': 'text/html',
		'Content-Length': htmloutput.length,
		'Expires': new Date().toUTCString()
	});
	res.end(htmloutput);
});



apiRoutes.use(function(req, res, next) {
	var fs = require("fs");
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, app.get('garagesaassecret'), function(err, decoded) {
			if (err) {
				var html = "";
			    html = fs.readFileSync('./app/public/index.html');
				res.writeHead(200, {
					'Content-Type': 'text/html',
					'Content-Length': html.length,
					'Expires': new Date().toUTCString()
				});
				return res.end(html);
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token
		// return an error
		// *********** really should be a page ********
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

apiRoutes.get('/home/', function(req, res){
        var token = req.param('token');
		var htmloutput = fs.readFileSync('./app/public/mechanic/mechanic-admin.html');
        htmloutput = htmloutput + '<input type="hidden" name="token" id="token" value="'+token+'" />';
		htmloutput = htmloutput + '<input type="hidden" name="username" id="username" value="{Your Garage}" />';
		htmloutput = htmloutput + '<input type="hidden" name="usernamegarage" id="usernamegarage" value="Your Garage" />';
        htmloutput = htmloutput + '</body></html>';
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': htmloutput.length,
            'Expires': new Date().toUTCString()
        });
        res.end(htmloutput);
});



apiRoutes.post('/save/blog/image/list', function(req, res) {
	var moment = require('moment');
	var timestampnice = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmss');
	var status = req.body.status;
	var postid = req.body.userid;
	postid = postid + '' + timestamp;
	var imageurlfull = 'https://chromemufflerbearing.com/uploads/' + req.body.userid + '/' + req.body.imageurl;

	var statussave = new blogImageListCMB({
            userid: req.body.userid,
			username: req.body.username,
			imageurl: req.body.imageurl,
			imageurlfull: imageurlfull,
			statustitle: req.body.statustitle,
			status: status,
			upvote: req.body.upvote,
			postid: postid,
			timestampnice: timestampnice,
            timestamp: timestamp
    });
    statussave.save(function(err) {
            if (err) throw err;
            console.log('Vehicle Saved');
			res.json({ success: true, username: req.body.username, postid: postid });
    });
});


apiRoutes.post('/move/blog/image', function(req, res){
	var fs = require("fs");
	var moment = require('moment');
	var userid = req.body.userid;
	var savefilename = req.body.imageurl;
	var postid = req.body.postid;
	var mkdirp = require('mkdirp');
	var timenow = moment().format('YYYYMMDDkkmmss');
	var savedas = timenow + savefilename;
	mkdirp('./app/public/uploads/' + userid, function(err){
		if (err) console.error(err);
		else console.log('pow!');
		fs.rename('./app/public/uploads/' + savefilename, './app/public/uploads/'+userid+'/'+savedas, function (err) {
			if (err) throw err;
			res.send(savedas);
		});	

	});
});

apiRoutes.post('/check/blog/image/exists', function(req, res){

	const fs = require('fs')
	var savefilename = req.body.imageurl;
	const path = './app/public/uploads/' + savefilename;
	fs.access(path, fs.F_OK, (err) => {
		if (err) {
			res.send('no');
			console.error(err)
			return
		}
		res.send('yes');
	})

});


apiRoutes.post('/save/status/comment', function(req, res) {

	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var commentid = moment().format('YYYYMMDDkkmmss');
    var commentsave = new fiveoStatusComment({
            userid: req.body.userid,
			username: req.body.username,
			comment: req.body.comment,
			postid: req.body.postid,
			commentid: commentid,
            timestamp: datetimenow
    });
    commentsave.save(function(err) {
            if (err) throw err;
            console.log('Vehicle Saved');
			res.json({ success: true, username: req.body.username });
    });
});

apiRoutes.post('/view/status/comment', function(req, res) {
	fiveoStatusComment.find({ postid: req.body.postid }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});






/* dvi admin */
apiRoutes.post('/send1', function(req, res) {
	var sendto = req.body.sendto;
	var sendwhat = req.body.sendwhat;
	jkwAlertInfo.findOne({plate: sendto }, function(err, user) { 
		if (err) return console.error(err);
		var alerttype = user.alerttype;
		if (alerttype === 'all' || alerttype === 'text') {
			client.messages.create({
				body: sendwhat,
				to: '+1' + sendto,  // Text this number 
				from: '+1' + valid_twilio_number // From a valid Twilio number GARAGESAASCODEHERE
			})
			.then((message) => console.log(message.sid));	
		}
		res.send(alerttype);	
	});

});
apiRoutes.post('/check/alert/status', function(req, res) {
	var sendto = req.body.sendto;
	jkwAlertInfo.findOne({plate: sendto }, function(err, user) { 
		if (err) return console.error(err);
		var alerttype = user.alerttype;
		
		res.send(alerttype);	
	});
});

apiRoutes.post('/save/checkin', function(req, res) {
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD hh:mm a');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
    var carsave = new jkwRepairCheckin({
			plate:req.body.plate,
			vehicleid: req.body.vehicleid,
			invoiceid: req.body.invoiceid,
			timestamp: timestamp,
			nicetime: datetimenow
    });
    carsave.save(function(err) {
        if (err) throw err;
        console.log('Vehicle Saved');
		jkwRepairCheckin.find({plate:req.body.plate }, function(err, user) {
			if (err) return console.error(err);
			res.send(user);
		});
    });
});

apiRoutes.post('/save/expected/date', function(req, res) {
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD hh:mm a');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
    var carsave = new jkwRepairDoneDate({
			plate:req.body.plate,
			vehicleid: req.body.vehicleid,
			invoiceid: req.body.invoiceid,
			donedate: req.body.donedate,
			timestamp: timestamp,
			nicetime: datetimenow
    });
    carsave.save(function(err) {
        if (err) throw err;
        console.log('Vehicle Saved');
		jkwRepairDoneDate.find({ invoiceid:req.body.invoiceid}, function(err, user) {
			if (err) return console.error(err);
			res.send(user);
		});
    });
});
apiRoutes.post('/view/expected/date/list/full', function(req, res) {
	var moment = require('moment');
	jkwRepairDoneDate.find({ }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});


apiRoutes.post('/add/terms/to/list', function(req, res) {
	//the list of waivers available to attach to customer
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
    var carsave = new jkwRepairTermsList({
			termsid: timestamp,
			termstitle: req.body.termstitle,
			termstext: req.body.termstext,
			timestamp: timestamp,
			nicetime: datetimenow
    });
    carsave.save(function(err) {
        if (err) throw err;
        console.log('Vehicle Saved');
		jkwRepairTermsList.find({ }, function(err, user) {
			if (err) return console.error(err);
			res.send(user);
		});
    });
});
apiRoutes.post('/view/terms/list', function(req, res) {
	var moment = require('moment');
	jkwRepairTermsList.find({ }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});




apiRoutes.post('/attach/terms/to/invoice', function(req, res) {
	//the list of waivers attached to customer
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
    var carsave = new jkwRepairTerms({
			plate: req.body.plate,
			vehicleid: req.body.vehicleid,
			termsid: req.body.termsid,
			termstext: req.body.termstext,
			termstitle: req.body.termstitle,
			approvalstatus: req.body.approvalstatus,
			approvalsignature: req.body.approvalsignature,
			invoiceid: req.body.invoiceid,
			timestamp: timestamp,
			nicetime: datetimenow
    });
    carsave.save(function(err) {
        if (err) throw err;
        console.log('Vehicle Saved');
		jkwRepairTerms.find({ plate: req.body.plate }, function(err, user) {
			if (err) return console.error(err);
			res.send(user);
		});
    });
});

apiRoutes.post('/view/terms/by/invoice', function(req, res) {
	var moment = require('moment');
	jkwRepairTerms.find({ invoiceid: req.body.invoiceid, plate: req.body.plate }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});

app.post('/remove/terms/from/invoice/by/id', function(req, res) { 
	jkwRepairTerms.findOneAndRemove({invoiceid: req.body.invoiceid, termsid: req.body.termsid}, function(err, p) {
		if (!p) {
						res.json({ success: false, termsid: req.body.termsid });
		} else {
						res.json({ success: true, termsid: req.body.termsid });
		}

	});
});


apiRoutes.post('/view/terms/by/id', function(req, res) {
	var moment = require('moment');
	jkwRepairTermsList.find({ termsid: req.body.termsid }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});


apiRoutes.post('/view/attached/waivers', function(req, res) {
	var moment = require('moment');
	jkwRepairWaiverList.find({ }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});

apiRoutes.post('/view/waiver/list', function(req, res) {
	var moment = require('moment');
	jkwRepairWaiverList.find({ }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});
apiRoutes.post('/view/waiver/by/id', function(req, res) {
	var moment = require('moment');
	jkwRepairWaiverList.find({ waiverid: req.body.waiverid }, function(err, user) { 
		if (err) return console.error(err);
		res.send(user);
	});
});

apiRoutes.post('/add/waiver/to/list', function(req, res) {
	//the list of waivers available to attach to customer
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var displaydate = moment().format("MM/DD/YYYY");
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
    var carsave = new jkwRepairWaiverList({
			waiverid: timestamp,
			waivertitle: req.body.waivertitle,
			waivertext: req.body.waivertext,
			timestamp: timestamp,
			nicetime: datetimenow
    });
    carsave.save(function(err) {
        if (err) throw err;
        console.log('Vehicle Saved');
		jkwRepairWaiverList.find({ }, function(err, user) {
			if (err) return console.error(err);
			res.send(user);
		});
    });
});
apiRoutes.post('/attach/waiver/to/customer', function(req, res) {
	//the list of waivers attached to customer
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
    var carsave = new jkwRepairWaiver({
			plate: req.body.plate,
			vehicleid: req.body.vehicleid,
			waiverid: req.body.waiverid,
			waivertext: req.body.waivertext,
			waivertitle: req.body.waivertitle,
			approvalstatus: req.body.approvalstatus,
			approvalsignature: req.body.approvalsignature,
			timestamp: timestamp,
			nicetime: datetimenow
    });
    carsave.save(function(err) {
        if (err) throw err;
        console.log('Vehicle Saved');
		jkwRepairWaiver.find({ plate: req.body.plate }, function(err, user) {
			if (err) return console.error(err);
			res.send(user);
		});
    });
});
apiRoutes.post('/view/message/list/', function(req, res) {
	var moment = require('moment');
	jkwRepairChat.find({}, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	}).sort({timestamp: -1});
});

apiRoutes.post('/view/schedule/list/', function(req, res) {
	var moment = require('moment');
	jkwRepairSchedule.find({}, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	}).sort({appointment: -1});
});



apiRoutes.post('/view/invoice/list/typeof', function(req, res) {
	var moment = require('moment');
	var rotype = req.body.rotype;
	jkwRepairInvoice.find({typeof: rotype}, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	}).sort({timestamp: -1});
});

apiRoutes.post('/view/invoice/list/invoicestatus', function(req, res) {
	var moment = require('moment');
	var invoicestatus = req.body.invoicestatus;
	jkwRepairInvoice.find({invoicestatus: invoicestatus}, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	}).sort({timestamp: -1});
});


apiRoutes.post('/view/invoice/list/', function(req, res) {
	var moment = require('moment');
	var invoicestatus = req.body.invoicestatus;
	jkwRepairInvoice.find({}, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	}).sort({timestamp: -1});
});

apiRoutes.post('/view/vehicle/list/', function(req, res) {
	var moment = require('moment');
	jkwCarInfo.find({}, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	}).sort({timestamp: -1});
});
apiRoutes.post('/view/vehicle/list/ymme', function(req, res) {
	var moment = require('moment');
	var caryear = req.body.caryear;
	var carmake = req.body.carmake;
	var carmodel = req.body.carmodel;

	
	jkwCarInfo.find({year: caryear, make: carmake, model: carmodel }, function(err, user) { 
			if (err) return console.error(err);
			var theplate = user.plate;
			var thevehicleid = user.vehicleid;
			
			res.send(user);
	}).sort({timestamp: -1});	
	
	

});
apiRoutes.post('/view/alert/list/', function(req, res) {
	var moment = require('moment');
	jkwAlertInfo.find({}, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	}).sort({timestamp: -1});
});


apiRoutes.get('/view/repair/hour/:plate', function(req, res) {
	var moment = require('moment');
	jkwRepairHour.find({ plate: req.params.plate }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	});
});



apiRoutes.post('/save/repair/resolution', function(req,res){

	jkwRepairReason.findOne({plate: req.body.plate}, function(err, p) {
		if (!p) {
			var datetimenow = moment().format('YYYY-MM-DD kk:mm');
			var carsave = new jkwRepairReason({
					plate: req.body.plate,
					howtofix: req.body.howtofix,
					timestamp: datetimenow
			});
			carsave.save(function(err) {
					if (err) throw err;
					console.log('Vehicle Saved');
					res.json({ success: true, plate: req.body.plate });
			});
			return console.error(err);
		} else {
			p.howtofix = req.body.howtofix;
			p.save(function(err) {
				if (err) {

				} else {
					console.log('success')
					res.json({ success: true, plate: req.body.plate });
				}
			});
		}
	});
});


apiRoutes.get('/view/repair/resolution/:plate', function(req, res) {
	var moment = require('moment');
	jkwRepairReason.find({ plate: req.params.plate }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	});
});

apiRoutes.post('/add/inspection/list/part', function(req, res) {
	//the list of parts to inspect
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
    var carsave = new jkwInspectionPartList({
			listid: req.body.listid,
			partid: timestamp,
			part: req.body.part,
            timestamp: timestamp
    });
    carsave.save(function(err) {
        if (err) throw err;
        console.log('Vehicle Saved');
		jkwInspectionPartList.find({ listid: req.body.listid }, function(err, user) {
			if (err) return console.error(err);
			res.send(user);
		});
    });
});

apiRoutes.post('/view/inspection/part/list', function(req, res) {
	//the list of parts to inspect not the list of inspections
	jkwInspectionPartList.find({ listid: req.body.listid }, function(err, user) {
		if (err) return console.error(err);
		res.send(user);
	});

});
apiRoutes.post('/view/inspection/part/list/all', function(req, res) {
	//the list of parts to inspect not the list of inspections
	jkwInspectionPartList.find({ }, function(err, user) {
		if (err) return console.error(err);
		res.send(user);
	}).sort({listid: 1});

});
apiRoutes.post('/start/new/inspection/', function(req, res) {
	//start the actual inspection report
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
    var carsave = new jkwInspectionReport({
            plate: req.body.plate,
			vehicleid: req.body.vehicleid,
			inspectionstatus: req.body.inspectionstatus,
			inspectionid: timestamp,
            timestamp: timestamp
    });
    carsave.save(function(err) {
            if (err) throw err;
            console.log('Vehicle Saved');
			jkwInspectionReport.find({ plate: req.body.plate, inspectionid: timestamp }, function(err, user) { 
				if (err) return console.error(err);
				var theplate = user.plate;
				var thevehicleid = user.vehicleid;
				
				res.send(user);
			});

    });
});

apiRoutes.post('/view/inspection/list/', function(req, res) {
	//view the list of inspection reports.
	//app and apiroutes
	var moment = require('moment');
	jkwInspectionReport.find({ plate: req.body.plate }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	});
});

apiRoutes.post('/view/inspection/part/', function(req, res) {
	// the inspected parts as in the saved part condition
	// inspectionid is the inspection list
	// partid is the inspected part id from the parts list
	// this is the inspected part
	// the actual condition of the radiator water pump brake rotor or whatever inspected part is inspected
	jkwInspectionPart.find({ plate: req.body.plate, inspectionid: req.body.inspectionid }, function(err, user) { 
		if (err) return console.error(err);
		var theplate = user.plate;
		var thevehicleid = user.vehicleid;
		
		res.send(user);
	});
});

apiRoutes.post('/save/inspection/part/', function(req, res) {
	//add a part that was inspected: part: radiator, condition: red
	// unused now using edit
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
    var carsave = new jkwInspectionPart({
            plate: req.body.plate,
			partdesc: req.body.partdesc,
			partcondition: req.body.partcondition,
			inspectionid: req.body.inspectionid,
			notes: '',
			photourl: '',
			partid: req.body.partid,
            timestamp: timestamp
    });
    carsave.save(function(err) {
            if (err) throw err;
            console.log('Vehicle Saved');
			jkwInspectionPart.find({ plate: req.body.plate, timestamp: timestamp }, function(err, user) { 
				if (err) return console.error(err);
				var theplate = user.plate;
				var thevehicleid = user.vehicleid;
				
				res.send(user);
			});

    });
});

apiRoutes.post('/edit/inspection/part', function(req, res) {

	//add or edit a part that was inspected
	//part: radiator, condition: green
	//if it exists update it.
	// if it doesn't exist create it.
	jkwInspectionPart.findOne({plate: req.body.plate, partid: req.body.partid, inspectionid: req.body.inspectionid }, function(err, p) {
		if (!p) {
			var timestamp = moment().format('YYYYMMDDkkmmssSS');
			var datetimenow = moment().format('YYYY-MM-DD kk:mm');
			var carsave = new jkwInspectionPart({
					plate: req.body.plate,
					partdesc: req.body.partdesc,
					partcondition: req.body.partcondition,
					inspectionid: req.body.inspectionid,
					notes: '',
					photourl: '',
					partid: req.body.partid,
					timestamp: timestamp

				});
			carsave.save(function(err) {
					if (err) throw err;
					console.log('Vehicle Saved');
					jkwInspectionPart.find({ plate: req.body.plate, partid: req.body.partid, inspectionid: req.body.inspectionid }, function(err, user) { 
						if (err) return console.error(err);
						var theplate = user.plate;
						var thevehicleid = user.vehicleid;
						
						res.send(user);
					});
			});
			return console.error(err);
		} else {
			if (req.body.notes != null) {
				p.notes = req.body.notes;
			}
			if (req.body.photourl != null) {
				p.photourl = req.body.photourl;
			}
			if (req.body.partcondition != null) {
				p.partcondition = req.body.partcondition;
			}
			p.save(function(err) {
			if (err)
				res.send('no word');
			else
				console.log('success')
				jkwInspectionPart.find({ plate: req.body.plate, partid: req.body.partid, inspectionid: req.body.inspectionid }, function(err, user) { 
					if (err) return console.error(err);
					var theplate = user.plate;
					var thevehicleid = user.vehicleid;
					
					res.send(user);
				});
			});
		}
	});
});


apiRoutes.post('/edit/invoice', function(req,res) {
	jkwRepairInvoice.findOne({plate: req.body.plate, invoiceid: req.body.invoiceid}, function(err, p) {
		if (!p) {
			return console.error(err);
		} else {
			
			p.invoicestatus = req.body.invoicestatus;
			p.typeof = req.body.typeof;
			p.workdesc = req.body.workdesc;
			p.expecteddate = req.body.expecteddate;
			p.isnorepaircost = req.body.isnorepaircost;
			p.invoicesignature = req.body.invoicesignature;
			p.invoiceodometer = req.body.invoiceodometer;
			p.invoiceyearmake = req.body.invoiceyearmake;
			p.invoiceaddress = req.body.invoiceaddress;
			p.invoicecustomername = req.body.invoicecustomername;
			p.invoiceregistrationnumber = req.body.invoiceregistrationnumber;
			
			p.save(function(err) {
				if (err) {

				} else {
					console.log('success')
					
					res.json({ success: true, plate: req.body.plate });
				}
			});
		}
	});
});



apiRoutes.post('/start/new/invoice/', function(req, res) {
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmssSS');
    var carsave = new jkwRepairInvoice({
            plate: req.body.plate,
			vehicleid: req.body.vehicleid,
			invoicestatus: req.body.invoicestatus,
			typeof: req.body.typeof,
			workdesc: req.body.workdesc,
			expecteddate: req.body.expecteddate,
			isnorepaircost: req.body.isnorepaircost,
			invoicesignature: 'unsigned',
			approvalstatus: 'unanswered',
			invoiceid: timestamp,
			timestamp: timestamp,
			nicetime: datetimenow
    });
    carsave.save(function(err) {
            if (err) throw err;
            console.log('Vehicle Saved');
			jkwRepairInvoice.find({ plate: req.body.plate, invoiceid: timestamp }, function(err, user) { 
				if (err) return console.error(err);
				var theplate = user.plate;
				var thevehicleid = user.vehicleid;
				res.send(user);
			});

    });
});
apiRoutes.post('/save/repair/part', function(req, res) {
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmm');
    var carsave = new jkwRepairPart({
            plate: req.body.plate,
			vehicleid: req.body.vehicleid,
			partcondition: req.body.partcondition,
			partnumber: req.body.partnumber,
			part: req.body.part,
			partprice: req.body.partprice,
			partcount: req.body.partcount,
			linetotal: req.body.linetotal,
			expected: req.body.expected,
			invoiceid: req.body.invoiceid,
            timestamp: timestamp
    });
    carsave.save(function(err) {
            if (err) throw err;
            console.log('Vehicle Saved');
			jkwRepairPart.find({ plate: req.body.plate, invoiceid: req.body.invoiceid }, function(err, user) { 
				if (err) return console.error(err);
				var theplate = user.plate;
				var thevehicleid = user.vehicleid;
				
				res.send(user);
			});

    });
});
apiRoutes.get('/remove/part/:plate/:timestamp', function(req, res) {
	jkwRepairPart.findOneAndRemove({plate: req.params.plate, timestamp: req.params.timestamp}, function(err, p) {
		if (!p) {
				res.json({ success: false });
		} else {
			res.json({ success: true });					
		}

	});
});

apiRoutes.get('/remove/invoice/:plate/:invoiceid', function(req, res) {
	jkwRepairInvoice.findOneAndRemove({plate: req.params.plate, invoiceid: req.params.invoiceid}, function(err, p) {
		if (!p) {
				res.json({ success: false });
		} else {
			res.json({ success: true });					
		}

	});
});


apiRoutes.post('/save/repair/hour', function(req, res) {
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmmss');
    var carsave = new jkwRepairHour({
            plate: req.body.plate,
			vehicleid: req.body.vehicleid,
			techname: req.body.techname,
			hours: req.body.hours,
			hourprice: req.body.hourprice,
			linetotal: req.body.linetotal,
			desc: req.body.desc,
			expected: req.body.expected,
			invoiceid: req.body.invoiceid,
            timestamp: timestamp
    });
    carsave.save(function(err) {
            if (err) throw err;
            console.log('Vehicle Saved');
			jkwRepairHour.find({ plate: req.body.plate, invoiceid: req.body.invoiceid }, function(err, user) { 
				if (err) return console.error(err);
				var theplate = user.plate;
				var thevehicleid = user.vehicleid;
				
				res.send(user);
			});

		});
});
apiRoutes.get('/remove/hour/:plate/:timestamp', function(req, res) {
	jkwRepairHour.findOneAndRemove({plate: req.params.plate, timestamp: req.params.timestamp}, function(err, p) {
		if (!p) {
				res.json({ success: false });
		} else {
			res.json({ success: true });					
		}

	});
});


apiRoutes.post('/dvi/move/customer/image', function(req, res){
	var fs = require("fs");
	var moment = require('moment');
	var userid = req.body.plate;
	var savefilename = req.body.statusimg;
	var postid = req.body.postid;
	var mkdirp = require('mkdirp');
	var timenow = moment().format('YYYYMMDDkkmmss');
	var savedas = timenow + savefilename;
	mkdirp('./app/public/uploads/' + userid, function(err){
		if (err) console.error(err);
		else console.log('pow!');
		fs.rename('./app/public/uploads/' + savefilename, './app/public/uploads/'+userid+'/'+savedas, function (err) {
			if (err) throw err;
			res.send(savedas);
			var datetimenow = moment().format('YYYY-MM-DD kk:mm');
			var vehicleid = moment().format('YYYYMMDDkkmm');
			var carsave = new jkwRepairStatus({
					plate: req.body.plate,
					vehicleid: req.body.vehicleid,
					status: req.body.status,
					statusimg: savedas,
					statustype: req.body.statustype,
					timestamp: datetimenow
			});
			carsave.save(function(err) {
					if (err) throw err;
					console.log('Vehicle Saved');
					res.json({ success: true, plate: req.body.plate, vehicleid: req.body.vehicleid });
			});


		});	

	});
});

apiRoutes.post('/save/repair/status', function(req, res) {
	var moment = require('moment');
	var datetimenow = moment().format('YYYY-MM-DD kk:mm');
	var timestamp = moment().format('YYYYMMDDkkmm');
    var carsave = new jkwRepairStatus({
            plate: req.body.plate,
			vehicleid: req.body.vehicleid,
			status: req.body.status,
			statusimg: req.body.statusimg,
			statustype: req.body.statustype,
			nicetime: req.body.nicetime,
            timestamp: timestamp
    });
    carsave.save(function(err) {
            if (err) throw err;
            console.log('Vehicle Saved');
			res.json({ success: true, plate: req.body.plate, vehicleid: req.body.vehicleid });
    });
});
/*new */

apiRoutes.get('/g/home/:plate', function(req, res) {
	var moment = require('moment');
	var htmloutput = fs.readFileSync('./app/public/mechanic/mechanic-index.html');
	var toke = req.param('token')

	jkwPlateInfo.findOne({ plate: req.params.plate }, function(err, user) { 
		if (err) {
			var theplate = user.plate;
			var thevehicleid = user.vehicleid;
			htmloutput = htmloutput + '</body>';
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Content-Length': htmloutput.length,
				'Expires': new Date().toUTCString()
			});
			res.end(htmloutput);
			return;
			
		} else {
			if (!user) {
				var datetimenow = moment().format('YYYY-MM-DD kk:mm');
				var vehicleid = moment().format('YYYYMMDDkkmm');
				var carsave = new jkwPlateInfo({
					plate: req.body.plate,
					vehicleid: vehicleid,
					timestamp: datetimenow
				}); 
				carsave.save(function(err) {
						if (err) throw err;
						console.log('Vehicle Saved');
						htmloutput = htmloutput + '<input type="hidden" name="inspectionid" id="inspectionid" value="0" />';
						htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="0" />';
						htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+vehicleid+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+req.params.plate+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="token" id="token" value="'+toke+'" />';

						htmloutput = htmloutput + '</body>';
						res.writeHead(200, {
							'Content-Type': 'text/html',
							'Content-Length': htmloutput.length,
							'Expires': new Date().toUTCString()
						});
						res.end(htmloutput);
						
				});

			} else {
				var theplate = user.plate;
				var thevehicleid = user.vehicleid;
				htmloutput = htmloutput + '<input type="hidden" name="inspectionid" id="inspectionid" value="0" />';
				htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="0" />';
				htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+thevehicleid+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+theplate+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="token" id="token" value="'+toke+'" />';

				htmloutput = htmloutput + '</body>';
				res.writeHead(200, {
					'Content-Type': 'text/html',
					'Content-Length': htmloutput.length,
					'Expires': new Date().toUTCString()
				});
				res.end(htmloutput);
			}
		}
	});
});


apiRoutes.get('/g/message/:plate', function(req, res) {
	var moment = require('moment');
	var htmloutput = fs.readFileSync('./app/public/mechanic/mechanic-message.html');
	var toke = req.param('token');

	jkwPlateInfo.findOne({ plate: req.params.plate }, function(err, user) { 
		if (err) {
			var theplate = user.plate;
			var thevehicleid = user.vehicleid;
			htmloutput = htmloutput + '</body>';
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Content-Length': htmloutput.length,
				'Expires': new Date().toUTCString()
			});
			res.end(htmloutput);
			return;
		} else {
			if (!user) {
				var datetimenow = moment().format('YYYY-MM-DD kk:mm');
				var vehicleid = moment().format('YYYYMMDDkkmm');
				var carsave = new jkwPlateInfo({
					plate: req.body.plate,
					vehicleid: vehicleid,
					timestamp: datetimenow
				}); 
				carsave.save(function(err) {
						if (err) throw err;
						console.log('Vehicle Saved');
						htmloutput = htmloutput + '<input type="hidden" name="inspectionid" id="inspectionid" value="0" />';
						htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="0" />';
						htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+vehicleid+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+req.params.plate+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="token" id="token" value="'+toke+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="username" id="username" value="Your Garage" />';
						htmloutput = htmloutput + '<input type="hidden" name="usernamegarage" id="usernamegarage" value="Your Garage" />';

						htmloutput = htmloutput + '</body>';
						res.writeHead(200, {
							'Content-Type': 'text/html',
							'Content-Length': htmloutput.length,
							'Expires': new Date().toUTCString()
						});
						res.end(htmloutput);
				});

			} else {
				var theplate = user.plate;
				var thevehicleid = user.vehicleid;
				htmloutput = htmloutput + '<input type="hidden" name="inspectionid" id="inspectionid" value="0" />';
				htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="0" />';
				htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+thevehicleid+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+theplate+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="token" id="token" value="'+toke+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="username" id="username" value="Your Garage" />';
				htmloutput = htmloutput + '<input type="hidden" name="usernamegarage" id="usernamegarage" value="Your Garage" />';

				htmloutput = htmloutput + '</body>';
				res.writeHead(200, {
					'Content-Type': 'text/html',
					'Content-Length': htmloutput.length,
					'Expires': new Date().toUTCString()
				});
				res.end(htmloutput);
			}
		}
	});
});


apiRoutes.get('/g/inspection/:plate/:inspectionid', function(req, res) {
	var moment = require('moment');
	var htmloutput = fs.readFileSync('./app/public/mechanic/mechanic-inspection.html');
	var toke = req.param('token')

	jkwPlateInfo.findOne({ plate: req.params.plate }, function(err, user) { 
		if (err) {
			var theplate = user.plate;
			var thevehicleid = user.vehicleid;
			htmloutput = htmloutput + '</body>';
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Content-Length': htmloutput.length,
				'Expires': new Date().toUTCString()
			});
			res.end(htmloutput);
			return;
		} else {
			if (!user) {
				var datetimenow = moment().format('YYYY-MM-DD kk:mm');
				var vehicleid = moment().format('YYYYMMDDkkmm');
				var carsave = new jkwPlateInfo({
					plate: req.body.plate,
					vehicleid: vehicleid,
					timestamp: datetimenow
				}); 
				carsave.save(function(err) {
						if (err) throw err;
						console.log('Vehicle Saved');
						var inspectionid = req.params.inspectionid;
						htmloutput = htmloutput + '<input type="hidden" name="inspectionid" id="inspectionid" value="'+inspectionid+'" />';				
						htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+vehicleid+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+req.params.plate+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="token" id="token" value="'+toke+'" />';

						htmloutput = htmloutput + '</body>';
						res.writeHead(200, {
							'Content-Type': 'text/html',
							'Content-Length': htmloutput.length,
							'Expires': new Date().toUTCString()
						});
						res.end(htmloutput);
				});

			} else {
				var theplate = user.plate;
				var thevehicleid = user.vehicleid;
				var inspectionid = req.params.inspectionid;
				htmloutput = htmloutput + '<input type="hidden" name="inspectionid" id="inspectionid" value="'+inspectionid+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+thevehicleid+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+theplate+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="token" id="token" value="'+toke+'" />';

				htmloutput = htmloutput + '</body>';
				res.writeHead(200, {
					'Content-Type': 'text/html',
					'Content-Length': htmloutput.length,
					'Expires': new Date().toUTCString()
				});
				res.end(htmloutput);
			}
		}
	});
});



apiRoutes.get('/g/invoice/:plate/:invoiceid', function(req, res) {
	var moment = require('moment');
	var htmloutput = fs.readFileSync('./app/public/mechanic/mechanic-invoice.html');
	var toke = req.param('token')

	jkwPlateInfo.findOne({ plate: req.params.plate }, function(err, user) { 
		if (err) {
			var theplate = user.plate;
			var thevehicleid = user.vehicleid;
			htmloutput = htmloutput + '</body>';
			res.writeHead(200, {
				'Content-Type': 'text/html',
				'Content-Length': htmloutput.length,
				'Expires': new Date().toUTCString()
			});
			res.end(htmloutput);
			return;
		} else {
			if (!user) {
				var datetimenow = moment().format('YYYY-MM-DD kk:mm');
				var vehicleid = moment().format('YYYYMMDDkkmm');
				var carsave = new jkwPlateInfo({
					plate: req.body.plate,
					vehicleid: vehicleid,
					timestamp: datetimenow
				}); 
				carsave.save(function(err) {
						if (err) throw err;
						console.log('Vehicle Saved');
						var invoiceid = req.params.invoiceid;
						htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="'+invoiceid+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+vehicleid+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+req.params.plate+'" />';
						htmloutput = htmloutput + '<input type="hidden" name="token" id="token" value="'+toke+'" />';

						htmloutput = htmloutput + '</body>';
						res.writeHead(200, {
							'Content-Type': 'text/html',
							'Content-Length': htmloutput.length,
							'Expires': new Date().toUTCString()
						});
						res.end(htmloutput);
				});

			} else {
				var theplate = user.plate;
				var thevehicleid = user.vehicleid;
				var invoiceid = req.params.invoiceid;
				htmloutput = htmloutput + '<input type="hidden" name="invoiceid" id="invoiceid" value="'+invoiceid+'" />';		
				htmloutput = htmloutput + '<input type="hidden" name="vehicleid" id="vehicleid" value="'+thevehicleid+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="theplate" id="theplate" value="'+theplate+'" />';
				htmloutput = htmloutput + '<input type="hidden" name="token" id="token" value="'+toke+'" />';

				htmloutput = htmloutput + '</body>';
				res.writeHead(200, {
					'Content-Type': 'text/html',
					'Content-Length': htmloutput.length,
					'Expires': new Date().toUTCString()
				});
				res.end(htmloutput);
			}
		}
	});
});




/*end new */

/* dvi admin end */


app.use('/jkw', cusRoutes);

app.use('/api', apiRoutes);
app.listen(3000);