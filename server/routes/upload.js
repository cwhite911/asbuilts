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
      limits: {
        fileSize: 100
      },
      //Creates new directory and/or add new file to proper directory
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
    //Accepts one argument filename and returns an object that defines whether the file exisits.
      .get(function(req, res){
        //Sets up response data
        var data = {
            filename: req.query.filename,
            folder : req.query.filename.split('-')[0]
          };
        //Checks if the file exisits
        fs.stat('./public/documents/' + data.folder + '/' + data.filename, function (err, stats){
          if (err) {
            data.exisits = false;
            res.json(data)
          }
          else if (stats.isFile()){
            data.exisits = true;
            res.json(data);
          }
        });
        console.log('Request made with query ' + data.filename);
      })
      //Used to upload images to server
      .post(function(req, res){
        res.json(req.file);
      });


    module.exports = router;
