'use strict';

var express = require('express'),
    logger = require('morgan'),
    busboy = require('connect-busboy'),
    router = express.Router();

router.route('/upload')
  .all(morgan())
  .post(function(req, res){

  });


module.exports = router;
