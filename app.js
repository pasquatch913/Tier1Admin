var express = require('express');
var session  = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var http = require('http');
var path = require('path');
var app = express();
var port = process.env.PORT || 8080;

var passport = require('passport');
var flash    = require('connect-flash');

// pass passport for configuration
require('./config/passport')(passport);

// connect to mongodb cookie store
mongoose.connect('mongodb://localhost:27017');

// view engine setup
app.set('view engine', 'ejs');

// no favicon in /public
//app.use(express.favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

// mongodb cookie store for users
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
	secret: 'paschallSecret', // secret
	resave: false,
	saveUninitialized: false,
  maxAge: new Date(Date.now() + 3600000)
 }));
app.use(passport.initialize());
app.use(passport.session());
//app.use(flash()); // used for flash alerts in UI. not currently working

// routes
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch
app.listen(port);
console.log('The magic happens on port ' + port);
