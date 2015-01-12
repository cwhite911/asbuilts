'use strict';

var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    multer  = require('multer'),
    fs = require('fs');

    //Enable CORS
    router.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    router.use(bodyParser.json()); // for parsing application/json
    router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
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
          var source = fs.createReadStream(file.path);
          var dest = fs.createWriteStream(folder + '/' + file.name);
          source.pipe(dest)
            .on('end', function(){
              console.log('File Copied:' + file.name);
              fs.unlink(file.path, function (err){
                if (err) throw err;
                console.log('successfully deleted ' + file.path);
              });
            })
            .on('error', function(err){
              console.log(err);
              if(err) throw err;
            });



      }
    }));


    router.route('/')
      .get(function(req, res){
        console.log("I GET it...");
        res.send('GET requests are not accepted');
      })
      .post(function(req, res){
        res.json(req.body);
      });


    module.exports = router;
