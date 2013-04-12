
//
// Module dependencies.
//

var express = require('express'),
    mongoose = require('mongoose'),
    config = require('./config'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    models = require('./models');

//
// Data setup
//

mongoose.connect(config.mongoUri);

var app = module.exports = express();

app.configure(function(){
  app.set('port', config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express['static'](path.join(__dirname, 'public')));
});

var key;
for (key in routes) {
  if (routes.hasOwnProperty(key)) {
    routes[key](app);
  }
}

app.configure('development', function(){
  app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
