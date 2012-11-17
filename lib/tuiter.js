
/*
 * Module dependencies
 */

var request = require('superagent')
  , OAuth = require('oauth').OAuth
  , NJStream = require('njstream')
  , endpoints = require('./endpoints.json')
  , util = require('util')
  , debug = require('debug')('tuiter');

/*
 * Perform API calls against Twitter API
 */

require('superagent-oauth')(request);

/*
 * Constructor
 *
 * @param {Object} oauth_params: OAuth settings
 * @return {Object} new instance
 */

function Tuiter(oauth_params){
  debug('Creating Tuiter object');
  this.OAuth(oauth_params);
  debug('Tuiter object created');
  return this;
}

/*
 * Version
 */

Tuiter.version = '0.2.1';

/*
 * OAuth
 */

Tuiter.prototype.OAuth = function(params) {
  this.access_token_key = params.access_token_key || null;
  this.access_token_secret = params.access_token_secret || null;

  this.oa = new OAuth(
      endpoints.requestToken.resource
    , endpoints.accessToken.resource
    , params.consumer_key
    , params.consumer_secret
    , '1.0'
    , null
    , 'HMAC-SHA1'
  );
};

/*
 * Argument Tuiter prototype with Streaming methods
 */

Object.keys(endpoints).forEach(function(key){
  Tuiter.prototype[key] = function(params, callback){
    debug('Tuiter#%s method called', key);
    if('function' == typeof params){
      callback = params;
      params = {};
    }

    debug('processing query parameters');
    preProcess(params);
    debug('query parameters processed');
    debug('starting API call for %s', endpoints[key].resource);
    APIRequest.call(this, endpoints[key], params, callback);
    return this;
  };
});

var APIRequest = function(endpoint, params, callback) {
  var self = this;
  // supply url vars
  var url = endpoint.resource
    , url_vars = endpoint.resource.match(/\/:\w+/) || [];
    url_vars.forEach(function(url_var){
    url = url.replace(url_var, '/' + params[url_var.substr(2)]);
  });

  var req = request(endpoint.method, url)
            .sign(self.oa, self.access_token_key, self.access_token_secret)
            .query(params)
            .set('Accept', '*/*')
            .set('User-Agent', 'Tuiter for node.js')
            .set('Accept-Encoding', 'deflate, gzip');

  // raw special chars (at least special for twitter API)
  req.req.path = req.req.path
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');

  if (endpoint.streaming) {
    var res = new NJStream('\r');
    res.emitAPIEvents();
    this.autoReconnect(req, res, arguments);

    req.pipe(res);
    callback(res);
  } else {
    req.end(function(res){
      debug('data received for %s', endpoint.resource);
      callback(res.error, res.body);
    });
  }
};

/*
 * Auto reconnect
 */

Tuiter.prototype.autoReconnect = function(req, resp, args){
  var self = this;

  this.tcp_timeout = this.tcp_timeout || 250;
  this.http_timeout = this.http_timeout || 5000;
  this.rate_timeout = this.rate_timeout || 60000;
  
  req.on('error', function(error){
    debug('tcp error encountered, starting reconnection process');
    resp.emit('error', error);

    setTimeout(function(){ APIRequest.apply(self, args); }, self.tcp_timeout);

    self.tcp_timeout *= 2;
  });

  req.on('response', function(res){
    if(res.statusCode > 200 && res.statusCode !== 420) {
      debug('http error encountered, starting reconnection process');

      resp.emit('error', {statusCode: res.statusCode, text: res.text});

      setTimeout(function(){
        APIRequest.apply(self, args);
      }, self.http_timeout);

      self.http_timeout = Math.min(self.http_timeout + 250, 32000);
    }
    else if(res.statusCode === 420) {
      debug('rate limit error encountered, starting reconnection process');

      resp.emit('error', {statusCode: res.statusCode, text: res.text});

      setTimeout(function(){
        APIRequest.apply(self, args);
      }, self.rate_timeout);

      self.rate_timeout *= 2;
    } else {
      self.rate_timeout = null;
      self.http_timeout = null;
      debug('start streaming data');
    }

    res.on('error', function(error){
      debug('rate limit error encountered, starting reconnection process');

      resp.emit('error', { statusCode: res.statusCode, text: res.text });

      setTimeout(function(){
        APIRequest.apply(self, args);
      }, self.rate_timeout);

      self.rate_timeout *= 2;
    });

    res.on('end', function(){
      if(res.statusCode === 200) {
        debug('connection ended, starting reconnection process');

        APIRequest.apply(self, args);
        
        self.tcp_timeout = null;
        self.http_timeout = null;
      }
    });
  });
};

/*
 * Export new constructor wrapper
 */

module.exports = function(oauth_params){
  return new Tuiter(oauth_params);
};


/*
 * Preprocess tweet params
 */

var preProcess = function(obj) {
    
    // locations
  if(util.isArray(obj.locations)){
    obj.locations =  obj.locations.map(function(el){
      return el.long + ',' + el.lat;
    });
  }

  for(var i in obj)
    if(util.isArray(obj[i])) obj[i] = obj[i].join(',');
};

/*
 * Augment NJStream prototype to emit
 * "Twitter API events"
 */

NJStream.prototype.emitAPIEvents = function() {
  this.on('parsed', function(json_data){
    if ('undefined' != typeof json_data.delete) {
      this.emit('delete', json_data);
    } else if ('undefined' != typeof json_data.limit) {
      this.emit('limit', json_data);
    } else if ('undefined' != typeof json_data.scrub_geo) {
      this.emit('scrub_geo', json_data);
    } else {
      this.emit('tweet', json_data);
    }
  });
};
