
/*
 * Module dependencies
 */

var request = require('superagent')
  , OAuth = require('oauth').OAuth
  , NJStream = require('njstream')
  , endpoints = require('./endpoints.json')
  , util = require('util')
  , debug = require('debug')('tuiter');

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
  this.sleep_duration = 0;
  debug('Tuiter object created');
  return this;
}

/*
 * Version
 */

Tuiter.version = '0.2.12';

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
    params = preProcess(params);
    debug('Starting API call for %s', endpoints[key].resource);
    this.APIRequest(endpoints[key], params, callback);
    return this;
  };
});

/*
 * API OAuth signed requests
 */

Tuiter.prototype.APIRequest = function(endpoint, params, callback) {
  var url = endpoint.resource
    , url_vars = endpoint.resource.match(/\/:\w+/) || [];

  url_vars.forEach(function(url_var){
    url = url.replace(url_var, '/' + params[url_var.substr(2)]);
  });

  var req = request(endpoint.method, url)
            .sign(this.oa, params.access_token_key 
                  || this.access_token_key, 
                    params.access_token_secret 
                  || this.access_token_secret)
            .query(params)
            .set('Accept', '*/*')
            .set('User-Agent', 'Tuiter for node.js')
            .set('Accept-Encoding', 'gzip, deflate');

  // handle special characters
  req.req.path = req.req.path
     .replace(/!/g, '%21')
     .replace(/'/g, '%27').replace(/\(/g, '%28')
     .replace(/\)/g, '%29').replace(/\*/g, '%2A');
	
	req.tuiter = {
		endpoint: endpoint,
		params: params,
		callback: callback
	};

  (endpoint.streaming) ? 
		this.handleStream(req) : this.handleSimpleRequest(req);
};

/*
 * Handle simple request
 */

Tuiter.prototype.handleSimpleRequest = function(req) {
  var self = this;
  
  req.on('error', req.tuiter.callback);
  req.end(function(res){
		res.tuiter = req.tuiter;
		if(res.statusCode === 429)
			self.handleRateLimit(res);
		else
			req.tuiter.callback(res.error, res.body);
  });
};


/*
 * Handle data stream
 */

Tuiter.prototype.handleStream = function(req) {
  var self = this;
  req.parse(function(){});
  var stream = req.tuiter.stream = new NJStream('\r');
  stream.emitAPIEvents();
  this.autoReconnect(req);
  req.buffer(false);
  req.pipe(stream);
	req.tuiter.callback(stream);
};

/*
 * Auto reconnect
 */

Tuiter.prototype.autoReconnect = function(req) {
	var self = this;
  this.resetTimers();
	var stream= req.tuiter.stream;

  stream.on('end', function(){ 
		req.emit('end');
    stream.end();
  });

  stream.on('reconnect', function(new_args){ 
    var params = new_args || req.tuiter.params;
		params = preProcess(params);
    self.APIRequest(req.tuiter.endpoint, params, req.tuiter.callback);
		stream.emit('end');
  });

  req.on('error', this.reconnectTCP.bind(this, stream));

  req.on('response', function(res){
		res.tuiter = req.tuiter;
		if(res.statusCode === 429) {
			self.handleRateLimit(res);
    } else if(res.statusCode > 200 && res.statusCode !== 420) { 
      self.reconnectHTTP(stream);
    } else { 
      self.http_timeout = null;
      self.tcp_timeout = null;
			res.on('error', self.reconnectTCP.bind(self, stream));
			res.on('close', self.reconnectTCP.bind(self, stream));
      debug('Succesfully connected. Start streaming data');
    }
  });
};

/*
 * Reset backoff timers
 */

Tuiter.prototype.resetTimers = function() {
  this.tcp_timeout = this.tcp_timeout || 250;
  this.http_timeout = this.http_timeout || 5000;
};

Tuiter.prototype.handleRateLimit = function(res) {
	var self = this;
	self.sleep_duration = (res.header['x-rate-limit-reset']*1000 - new Date()) + 7000;
  debug('rate limit reached, sleeping during', Math.ceil(self.sleep_duration/60000), 'minutes');
  setTimeout(function() {
  	debug('rate limit reset, resuming extraction...');
		params = preProcess(res.tuiter.params);
    self.APIRequest(res.tuiter.endpoint, res.tuiter.params, res.tuiter.callback);
  }, self.sleep_duration);
};

/*
 * Handle TCP error
 */

Tuiter.prototype.reconnectTCP = function(stream) {
  debug('tcp error encountered. Will reconnect after ' + this.tcp_timeout + ' miliseconds.');
  setTimeout(function(){ stream.emit('reconnect'); }, this.tcp_timeout);
  this.tcp_timeout *= 2;
};

/*
 * Handle HTTP error
 */

Tuiter.prototype.reconnectHTTP = function(stream) {
  debug('http error encountered. Will reconnect after ' + this.http_timeout + ' miliseconds.');
  setTimeout(function(){ stream.emit('reconnect');}, this.http_timeout);
  this.http_timeout = Math.min(this.http_timeout + 250, 32000);
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

  // join arrays
  for(var i in obj)
    if(util.isArray(obj[i])) obj[i] = obj[i].join(',');

	return obj;
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

	// prevent uncaught exceptions
  this.on('error', function(){});
};
