var	express    = require('express');
var bodyParser = require("body-parser");
var	path 	   = require('path');
var validUrl   = require('valid-url');
var base62 	   = require('./base62');
var surl 	   = require('./models/surl');

var	app = express();
	app.use(express.static(__dirname + "/public"));
	app.use(bodyParser.json());

// This post method is used to create a object, which is to covert a longURL to a shortURL
app.post('/u/', function(req, res){

	var OriginalUrl = req.body.OriginalUrl;
	// Vlidate URL on server side
	if (validUrl.isWebUri(OriginalUrl)){

		surl.findOne({ OriginalUrl: OriginalUrl }, function (err, doc){
			if(err){
				handleError(res, err.message, "Failed to find a shortURL.");
			}else{
				// If the document exists, return
				if (doc){
					var ShortUrl = doc.ShortUrl;
					res.send({'ShortUrl': ShortUrl });
				}else{ 
				// Else, create one.
					var CreateAUniqSeed = function(res, OriginalUrl){
						// generate a random seed from 62^4 - 62^5 , 5 character short url		
						var seed = Math.floor( Math.random() * ( Math.pow(62,5) - Math.pow(62,4) )+ Math.pow(62,4));
						var ShortUrl = base62.encode(seed);
						surl.findOne({ ShortUrl: ShortUrl }, function(err, doc){
							// duplicated ShortUrl
							if(doc){
								CreateAUniqSeed(res, OriginalUrl);
							// Unique
							}else{
								var obj = surl({
									ShortUrl: ShortUrl, 
									OriginalUrl: OriginalUrl,
								}); 		
								obj.save(function(err) {
									if (err){
										handleError(res, err.message, "Failed to save shortURL.");
									}
								});
								res.send({'ShortUrl': ShortUrl });
							}
						});
					}
					CreateAUniqSeed(res, OriginalUrl);
				}
			}
		});
	}else{
		handleError(res, "Invalid URL", "Invalid URL");
	}

});

/*
// This get method is used to get all objects
app.get('/u/', function(req, res){

	surl.find({},function (err, doc){
		if(err){
				handleError(res, err.message, "Failed to find all shortURL.");
		}else{
			res.send(doc); 
		}
	});
});
//  This put method is used to create an obj
app.put('/user', function (req, res) {});
//  This delete method is used to delete an obj
app.delete('/u/:ShortUrl', function(req, res) {});
*/

//  This get method is used to redirect a shortURL to a  longURL  
app.get('/:ShortUrl', function(req, res){

	var ShortUrl = req.params.ShortUrl;
	// If it's the short url service 
	if(ShortUrl.length == 5){
		surl.findOne({ ShortUrl: ShortUrl}, function (err, doc){
			if (err){
				handleError(res, err.message, "Failed to find a shortURL.");
			}else{
				// if it exists in database, redirect
				if(doc){
					res.redirect(doc.OriginalUrl);
				// else return back to home
				}else{
					res.redirect('/');
				}
			}
		});
	// Redirect Undefined urls to homepage
	}else{
		res.redirect('/');
	}
});


// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
	console.log("ERROR: " + reason);
	res.status(code || 500).json({"error": message});
}

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

