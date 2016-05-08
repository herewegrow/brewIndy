/**
 * Created by ivan on 5/7/16.
 */

'use strict';

var express = require('express'),
    session = require('express-session'),
    bodyparser = require('body-parser'),
    requestify = require('requestify');

global.NODE_ENV = process.env.NODE_ENV;
const PORT = 8001;

global.rootDir = __dirname;

var app = express();
app.use(bodyparser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept,x-auth-token');
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});

console.log(__dirname);

//////////////Begin Nested Routes//////////////
var router = require('express').Router();

router.use('/places', require('./api/places.js'));
// router.use('/places', require('./places/places.js'));

// router.get('/version', function (req,res) {
//     var version = require('./version.json').version;
//     res.send(version);
// });
app.use('/api',router);

app.listen(PORT, function(){
    console.log(getConsoleTimeStamp() + ' brewIndy API listening on port ' + PORT + '.');
    console.log('Using [' + global.NODE_ENV + ']');
});

var getConsoleTimeStamp = function(){
    var date = new Date().toLocaleDateString();
    var time = new Date().toLocaleTimeString();

    return '[' + date + ' ' + time + ']';
};