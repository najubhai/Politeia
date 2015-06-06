var express = require('express');
var bodyParser = require('body-parser');
var rekognition = require('rekognition');
var nameDB = require('./fire.js');
var OpenSecretsClient = require('opensecrets');
var client = new OpenSecretsClient('***REMOVED***');

rekognition.config({
    api_key: "yRaOk6T9dONHHzvw",
    api_secret: "sgqKjcfFfNsHk4A9"
});

var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));

// var image = 'http://i.huffpost.com/gen/1082266/images/o-STEVE-COHEN-TWITTER-facebook.jpg';

app.post('/lookup', function(req, res) {
    var image = req.body.image;
    rekognition.faceDetect(image, function(err, body) {
        if (err)
            throw err;
        if (!err) {
            var nameList = JSON.parse(body).face_detection[0].name;
            var name = nameList.substring(0, nameList.indexOf(':'));
            name = name.replace('_', ' ');
            nameDB(name, function(cid) {
                client.candContrib(cid, function(err, json) {
                    if (err) throw err;
                    console.log('--------------' + name + '\'s Contributions------------');
                    for (var i = 0; i < json['contributor'].length; i++) {
                        console.log(json['contributor'][i]['@attributes'].org_name);
                    };
                });
            });
        };
    });
    res.end();
});

app.listen(process.env.PORT, function() {
    console.log("Server is up  running at port: " + process.env.PORT);
});