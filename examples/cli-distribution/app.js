
/**
 * Module dependencies.
 */

var express = require('express')
  , Tuiter = require('tuiter')
  , sio = require('socket.io')
  , http = require('http');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  res.render('index', { title: 'Twitter clients' });
});

var t = new Tuiter(require('./keys.json'));

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

var io = sio.listen(server);

io.enable('browser client minification');  
io.enable('browser client etag');          
io.enable('browser client gzip');          
io.set('log level', 1);                    
io.set('transports', [                     
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);


t.sample({}, function(stream){
  var client, temp;
  stream.on('tweet', function(data){
    temp = />.+</.exec(data.source);
    client = (temp) ? temp[0]  : data.source;
    client = client.replace('>','');
    client = client.replace('<','');
    io.sockets.emit('tweet', client);
  });

  stream.on('error', function(err){
    console.log(err);
  });
});

process.on('uncaughtException', function(err){
  console.log(err);
});
