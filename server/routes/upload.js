'use strict';

var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    multer  = require('multer');

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
router.use(multer({
  dest: './public/documents',
  rename: function (fieldname, filename){
    console.log(fieldname);
    console.log(filename);
  }
}));


router.route('/')
  .get(function(req, res){
    console.log("I GET it...");
    res.send('GET requests are not accepted');
  })
  .post(function(req, res){
    console.log(req.body);
    console.log(req.files);
    console.log(req.get('Content-Type'));
    res.json(req.body);
  });


module.exports = router;
