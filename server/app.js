'use strict';

var express = require('express'),
    app= express(),
    logger = require('morgan'),
    upload = require('./routes/upload');

//Set port
var port = process.env.PORT || 9080;

//Add middleware
app.use(logger('combined'));
app.use(express.static(__dirname + '/public'));

//Add Routes
app.use('/upload', upload);

//Set server to listen to port at 9080
app.listen(port, function(){
  console.log('Server is listening on port ' + port + '\n');
});
