var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var http = require('http').Server(app);
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var fs = require("fs");
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var port = process.env.PORT || 3000; 

var request = require('request');

//app.use(cors());
app.use(express.static(__dirname + '/app/public')); 				// set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
 

app.get('/', function(req, res) { // used in service worker
	res.sendfile('./app/public/install-index.html');
});

// the install replaces domain name and variable names in all the files to create a usable version
// of the saas.
app.post('/install', function(req, res) {
    //domain name swap procedure
        var firstTLD = req.body.ogdomain;
        var swapTLD = req.body.domain;
        const { exec } = require("child_process");
		
		exec("sed -i 's/"+firstTLD+"/"+swapTLD+"/gI' *.*", (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				res.send(`error: ${error.message}`);
				return;
			}
			if (stderr) {
				res.send(`stderr: ${stderr}`);
				return;
			}
			res.send(`stdout: ${stdout}`);
		});
});

app.post('/install1', function(req, res) {
        //domain name swap procedure

    var firstTLD = req.body.ogdomain;
    var swapTLD = req.body.domain;
    const { exec } = require("child_process");
    
    exec("sed -i 's/"+firstTLD+"/"+swapTLD+"/gI' app/public/*/*.html", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            res.send(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            res.send(`stderr: ${stderr}`);
            return;
        }
        
            res.send(`stdout: ${stdout}`);
        
    });
});
app.post('/install2', function(req, res) {
    //domain name swap procedure

    var firstTLD = req.body.ogdomain;
    var swapTLD = req.body.domain;
    const { exec } = require("child_process");
    
    exec("sed -i 's/"+firstTLD+"/"+swapTLD+"/gI' app/public/*/*.js", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            res.send(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            res.send(`stderr: ${stderr}`);
            return;
        }
        
            res.send(`stdout: ${stdout}`);
        
    });
});
app.post('/install3', function(req, res) {
    //domain name swap procedure with incredibly descriptive names lol oops

    var firstTLD = req.body.ogdomain;
    var swapTLD = req.body.domain;
    const { exec } = require("child_process");
    
    exec("sed -i 's/"+firstTLD+"/"+swapTLD+"/gI' app/public/*/*.css", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            res.send(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            res.send(`stderr: ${stderr}`);
            return;
        }
        
            res.send(`stdout: ${stdout}`);
        
    });
});



app.post('/install/server', function(req, res) {
    // this is for the actual server file configuration, replace vairables 
    // sendg_user, sendg_pass, twil_numb, twil_admin_numb, admin_email
    // str_server, str_public, twil_sid, twil_auth,

    // co_secret, co_database in config.js
    var firstTLD = req.body.search;
    var swapTLD = req.body.replace;
    const { exec } = require("child_process");
    
    exec("sed -i 's/"+firstTLD+"/"+swapTLD+"/gI' server.js", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            res.send(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            res.send(`stderr: ${stderr}`);
            return;
        }
        res.send(`stdout: ${stdout}`);
    });
});

app.post('/install/db', function(req, res) {
    // this is for the actual server file configuration, replace vairables 
    // co_secret, co_database in config.js
    var firstTLD = req.body.search;
    var swapTLD = req.body.replace;
    const { exec } = require("child_process");
    
    exec("sed -i 's/"+firstTLD+"/"+swapTLD+"/gI' config.js", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            res.send(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            res.send(`stderr: ${stderr}`);
            return;
        }
        res.send(`stdout: ${stdout}`);
    });
});



app.listen(3000);