'use strict';

var express = require('express'),
    app= express(),
    logger = require('morgan'),
    path = require('path'),
    // favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    session = require('cookie-session'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    login = require('./routes/login'),
    upload = require('./routes/upload');

//Set port
app.set('port', process.env.PORT || 8000);
//Add middleware
app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(session({ keys: ['secretkey1', 'secretkey2']}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(express.static(path.join(__dirname, 'public')));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// requires the model with Passport-Local Mongoose plugged in
var User = require('./models/user');

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Add Routes
// app.use('/register', login);
// app.use('/login', login);
// app.use('/logout', login);
app.use('/', require('./routes/login'));
app.use('/upload', upload);

// mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose', function(err) {
  if (err) {
    console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
  }
});



//Set server to listen to port at 9000
app.listen(app.get('port'), function(){
  console.log('Server is listening on port ' + app.get('port') + '\n');
});
