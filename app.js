var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var options = {
  host: 'http://btdemo.plurilock.com:8090',
  path: 'api/'
};


var routes = require('./routes/index');
var users = require('./routes/users');
var debug = require('debug')('http');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/request', function(req, res) {
  debug('start request for ' + req.body.userID + ', ' + req.body.domain);
  
  var userID = req.body.userID;
  var domain = req.body.domain;
  var test = req.body.test;
  debug("test is a " + typeof test['checked'])
  var url = 'http://btdemo.plurilock.com:8090/api/users/ios_' + userID + '_' + domain;
  if (test.hasOwnProperty(1)) {
    url = 'http://btdemo.plurilock.com:8090/api/users/web_bassam_plurilock';
  }
  var result = "";

  
  var options = {
    url: url,
    json:true
  };
  
  var request = require('request');
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      result = body;
      debug("body is " + typeof body)
      
      
      res.render('request', {
        title: 'Server Request',
        userID: userID,
        domain: domain,
        result: result
      });
      //console.log(body)
    } else {
      debug("What's this? " + response.statusCode)
      res.render('request', {
        title: 'Server Request',
        userID: userID,
        domain: domain,
        result: "Error: " + response.statusCode + ", Data not retrieved"
      });
    }
  })   

});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
