
/*
 * Module dependencies
 */

var OAuth = require('oauth').OAuth
  , Tuiter = module.parent.exports
  , qs = require('querystring')
  , events = require('events')
  , util = require('util')
  , config = require('./config.json');

/*
 * Stream object constructor
 */

function Stream(){
  events.EventEmitter.call(this);
}

util.inherits(Stream, events.EventEmitter);

/*
 * Auth
 *
 * @param {Obejct} params: OAuth params
 */ 

Tuiter.prototype.oauth = function(params){

  // defaults

  params.consumer_key = params.consumer_key || null;
  params.consumer_secret = params.consumer_secret || null;
  params.callback_url = params.callback_url || "http://localhost:3000/oauth/callback";

  this.oa = new OAuth(config.oauth.request_token_url, 
                      config.oauth.access_token_url, 
                      params.consumer_key, params.consumer_secret, 
                      config.oauth.version, 
                      null, 
                      config.oauth.method);

  this.oa.access_token_key = params.access_token_key;
  this.oa.access_token_secret = params.access_token_secret;
};

/*
 * API calls GET method
 *
 * @param {String} url: resource url
 * @param {Object} params: resource params
 * @param {Function} callback: callback funcion
 */

Tuiter.prototype.get = function(url, params, callback){
  url += (Object.keys(params).length) ? '?' : '';
  this.oa.get(url + qs.stringify(params), this.oa.access_token_key, this.oa.access_token_secret, function(err, data){
    try{
      data = JSON.parse(data);
      callback(err, data);
    } catch(e){
      callback(e, null);
    }
  });
};

/*
 * API calls POST method
 *
 * @param {String} url: resource url
 * @param {Object} params: resource params
 * @param {Function} callback: callback funcion
 */

Tuiter.prototype.post = function(url, params, callback){
  this.oa.post(url, this.oa.access_token_key, this.oa.access_token_secret, params, function(err, data){
    try{
      data = JSON.parse(data);
      callback(err, data);
    } catch(e){
      callback(e, null);
    }
  });
};

/*
 * Streaming API calls GET method
 *
 * @param {String} url: resource url
 * @param {Object} params: resource params
 * @param {Function} callback: callback funcion
 */

Tuiter.prototype.getStream = function(url, params, callback){
  var stream = new Stream();
   
  var req = this.oa.get(url + '?' + qs.stringify(params), this.oa.access_token_key, this.oa.access_token_secret);
  handleStream(req, stream, callback);

  reconnect.call(this, 'getStream', url, params, callback, stream);

  return this;
};

/*
 * Streaming API calls POST method
 *
 * @param {String} url: resource url
 * @param {Object} params: resource params
 * @param {Function} callback: callback funcion
 */

Tuiter.prototype.postStream = function(url, params, callback){
  var stream = new Stream();
  
  var req = this.oa.post(url, this.oa.access_token_key, this.oa.access_token_secret, params);

  handleStream(req, stream, callback);

  reconnect.call(this, 'postStream', url, params, callback, stream);

  return this;
};

var handleStream = function(req, stream, callback){
  var buf = '';
  
  stream.destroy = function(){
    req.destroy();
  }

  req.on('response', function(res){
    res.setEncoding('utf-8');

    callback(stream);

    checkResStatus(res.statusCode, stream);

    res.on('data', function(chunk){
      buf += chunk;
      if(buf.indexOf('\r') !== -1){
        buf = buf.slice(0, buf.length - 2);
        var arr_buf = buf.split('\r\n');
        try{
          arr_buf.forEach(function(elem){
            var json_stream = JSON.parse(elem);
            if(json_stream.delete)
              stream.emit('delete', json_stream);
            else if(json_stream.limit)
              stream.emit('limit', json_stream);
            else if(json_stream.scrub_geo)
              stream.emit('scrub_geo', json_stream)
            else 
              stream.emit('tweet', json_stream);
          });
        } catch(e){
          stream.emit('error', e);
        }
        buf = '';
      }
    });

    res.on('close', function(){
      stream.emit('connection error');
    });

    res.on('end', function(){
      stream.destroy();
    });

    stream.on('end', function(){
      stream.destroy();
    });

  });
  req.end();

  req.on('error', function(err){
    //todo tcp error reconnection
    callback(stream);
    stream.emit('error', err);
    stream.emit('tcp error', err);
  });

};

/*
 * Check response status code
 *
 * @param {Number} status
 * @param {Object} stream
 */

var checkResStatus = function(status, stream){
  if(status > 200){
    if(config.error[status]){
      stream.emit('error',{code: status, definition: config.error[status].definition, description: config.error[status].description});
    } else {
      stream.emit('error',{code: status, definition: 'Unrecognized error', description: 'Sorry. We dont know the kind of error. Check Twitter docs: https://dev.twitter.com/docs/error-codes-responses'});
    }

    stream.emit('http error', status);
  }
};

/*
 * Automatic reconnection
 */

var reconnect = function(method, url, params, callback, stream){

  var self = this;

  this.tcp_timer = this.tcp_timer || config.timers.tcp.min;
  this.http_timer = this.http_timer || config.timers.http.min;
  
  stream.on('tcp error', function(){
    stream.emit('end');

    if(self.tcp_timer < config.timers.tcp.max){
      setTimeout(function(){
        self[method](url, params, callback);
      }, self.tcp_timer);

      self.tcp_timer += config.timers.tcp.min;

    } else {
      delete self.tcp_timer;
      delete self.http_timer;
    }
  });

  stream.on('http error', function(){
    stream.emit('end');

    if(self.http_timer < config.timers.http.max){
      setTimeout(function(){
        self[method](url, params, callback);
      }, self.http_timer);

      self.http_timer *= 2;

    } else {
      delete self.tcp_timer;
      delete self.http_timer;
    }
  });

  stream.on('connection error', function(){
    stream.emit('end');
    self[method](url, params, callback);
  });
};
