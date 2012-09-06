
/*
 * Module dependencies
 */ 

var request = require('superagent')
  , OAuth = require('oauth').OAuth
  , NJStream = require('njstream')
  , endpoints = require('./endpoints.json')
  , config = require('./config.json')
  , util = require('util');

/*
 * Constructor
 *
 * @param {Object} oauth_params: OAuth settings
 * @return {Object} new instance
 */ 

function Tuiter(oauth_params){
  this.OAuth(oauth_params);
  return this;
}

/*
 * Version
 */

Tuiter.version = '0.1.6';

/*
 * Export new constructor wrapper
 */

module.exports = function(oauth_params){
  return new Tuiter(oauth_params);
};

/*
 * OAuth
 */

Tuiter.prototype.OAuth = function(params) {
  this.oa = new OAuth(
      config.oauth.request_token_url
    , config.oauth.access_token_url
    , params.consumer_key || null
    , params.consumer_secret || null
    , config.oauth.version
    , null
    , config.oauth.method
    , null
    , { 'Accept': '*/*', 'User-Agent': 'Tuiter', 'Accept-Encoding': 'deflate, gzip' }
  );

  this.oa.access_token_key = params.access_token_key || null;
  this.oa.access_token_secret = params.access_token_secret || null;
};

/*
 * Augment Tuiter prototype with Streaming methods
 */

Object.keys(endpoints).forEach(function(key){
  Tuiter.prototype[key] = function(params, callback){
    if("function" == typeof params){
      callback = params;
      params = {};
    }
    preProcess(params);
    APIRequest.call(this, endpoints[key], params, callback);
    return this;
  };
});

/*
 * Perform API calls against Twitter API
 */

require('superagent-oauth')(request);

var APIRequest = function(endpoint, params, callback) {

  // supply url vars
  var url = endpoint.resource
    , url_vars = endpoint.resource.match(/\/:\w+/) || [];
    url_vars.forEach(function(url_var){
    url = url.replace(url_var, '/' + params[url_var.substr(2)]); 
  });

  var req = request(endpoint.method, url)
            .sign(this.oa, this.oa.access_token_key, this.oa.access_token_secret)
            .set('Accept', '*/*')
            .set('User-Agent', 'Tuiter')
            .set('Accept-Encoding', 'deflate, gzip')
            .send(params);

  if(endpoint.streaming) {
    var res = new NJStream('\r');
    res.emitAPIEvents();
    req.pipe(res);
    callback(res);
  } else {
    req.end(function(res){
      callback(res.error, res.body);
    });
  }
};

/*
 * Preprocess tweet params
 */

var preProcess = function(obj) {
    
    // locations
  if(util.isArray(obj['locations'])){
    obj['locations'] =  obj['locations'].map(function(el){
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
    if("undefined" != typeof json_data.delete) this.emit('delete', json_data);
    else if("undefined" != typeof json_data.limit) this.emit('limit', json_data);
    else if("undefined" != typeof json_data.scrub_geo) this.emit('scrub_geo', json_data);
    else this.emit('tweet', json_data);
  });
};
