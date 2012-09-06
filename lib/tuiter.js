
/*
 * Module dependencies
 */ 

var request = require('superagent')
  , OAuth = require('oauth')
  , NJStream = require('njstream')
  , endpoints = require('./endpoints.json')
  , config = require('./config.json');

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
    params = params || {};
    APIRequest.call(this, endpoints[key], params, callback);
    return this;
  };
});

/*
 * Perform API calls against Twitter API
 */

require('superagent-oauth')(request);

var APIRequest = function(endpoint, params, callback) {

  var req = request
            .request(endpoint.method, endpoint.resource)
            .sign(this.oa, this.oa.access_token_key, this.oa.access_token_secret)
            .set('Accept', '*/*')
            .set('User-Agent', 'Tuiter')
            .set('Accept-Encoding', 'deflate, gzip')
            .send(params);

  if(endpoint.streaming) {
    var res = new njstream('\r');
    req.pipe(njstream);
    callback(njstream);
  } else {
    req.end(function(res){
      callback(res.error, res.body);
    });
  }
};
