'use strict';

var passport = require('passport'),
    Account = require('./../models/user'),
    bodyParser = require('body-parser'),
    router = require('express').Router();

// router.get('/', function(req, res) {
//   res.render('index', { user: req.user });
// });

//Enable CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

router.get('/register', function(req, res) {
  res.send('Hello');
  // res.render('register', {});
});

router.post('/register', function(req, res, next) {
  console.log('registering user');
  console.log(req.body);
  Account.register(new Account({ username: req.body.username }), req.body.password, function(err) {
    if (err) { console.log('error while user register!', err); return next(err); }

    console.log('user registered!');

    res.redirect('/');
  });
});

router.get('/login', function(req, res) {
  res.send(req.user);
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  var sid = req.session;
  console.log(req.session);
  res.json({
    id: req.session,
    user: {
      id: req.body.username,
      role: 'editor'
    }
  });
});


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
