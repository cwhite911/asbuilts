'use strict';

var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    multer  = require('multer'),
    fs = require('fs');

    //Middleware
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    //Enable CORS
    router.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    router.use(bodyParser.json()); // for parsing application/json
    router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    //Handles file uploads
    router.use(multer({
      dest: './public/documents',
      rename: function (fieldname, filename){
        console.log('File Name: ' + filename);
        //Checks if name matchs
        var re = /[0-9]{6}-[A-B]{2}-[0-9]*/;
        // if(re.test(filename)){
        //   console.log('Passed RegEx');
        //   return filename;
        // }
        // else {
        //   console.log('Failed RegEx');
        // }
        return filename;

      },
      onFileUploadComplete: function (file) {
        var folder = file.path.split('.')[0].split('-')[0];
        fs.mkdir(folder, function(err){
          if (err) return;
        });
        //Creates Read Stream to uploaded file
          var source = fs.createReadStream(file.path);
        //Sets the destination and creates write stream to that loacation
          var dest = fs.createWriteStream(folder + '/' + file.name);
        //Pipes  the source data to the destination
          source.pipe(dest);
          //Report data transfer
          source.on('data', function(chunk) {
              console.log('got %d bytes of data', chunk.length);
            });
            //Deletes original after readstream closes
            source.on('end', function(){
              console.log('File Copied:' + file.name);
              //Deletes Original
              fs.unlink(file.path, function (err){
                if (err) throw err;
                console.log('successfully deleted ' + file.path);
              });
            });
            source.on('error', function(err){
              console.log(err);
              if(err) throw err;
            });



      }
    }));

    //Routes
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Define Routes in router
    router.route('/')
      .get(function(req, res){
        console.log('Request made with query ' + req.query);
        res.send('GET requests are not accepted');
      })
      .post(function(req, res){
        res.json(req.file);
      });


    module.exports = router;
