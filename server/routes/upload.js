'use strict';

var express = require('express'),
    logger = require('morgan'),
    multer  = require('multer'),
    router = express.Router();

router.use(logger('combined'));

router.route('/upload')
  .get(function(req, res){
    console.log("I posted");
    res.send('GET requests are not accepted');
  })
  .post(function(req, res){
    console.log("I posted");
    res.send('Post successful');
  });


module.exports = router;
