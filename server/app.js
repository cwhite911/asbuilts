'use strict';

var express = require('express'),
    app= express(),
    upload = require('./routes/upload')

var port = process.env.PORT || 9080;

app.use(express.static(__dirname + '/public'));
app.use('/upload', upload);

app.listen(port, function(){
  console.log('Server is listening on port ' + port + '\n');
});
