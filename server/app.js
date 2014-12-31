'use strict';

var express = require('express'),
    app = express(),
    upload = require('./routes/upload')

var port = process.env.PORT || 9080;

app.use('/upload', router);

app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});
