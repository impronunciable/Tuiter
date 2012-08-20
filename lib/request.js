
/*
 * Module dependencies
 */

var OAuth = require('oauth').OAuth
  , Tuiter = module.parent.exports
  , events = require('events')
  , util = require('util')
  , request = require('superagent')
  , config = require('./config.json');

require('superagent-oauth')(request);

/*
 * Stream object constructor
 */

function Stream(){
  events.EventEmitter.call(this);
};

util.inherits(Stream, events.EventEmitter);

Stream.prototype.destroy = function(){
  this.removeAllListeners('tweet');
  this.removeAllListeners('scrub_geo');
  this.removeAllListeners('delete');
  this.removeAllListeners('error');
  this.removeAllListeners('limit');
};

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
      config.oauth.access_token_url
    , params.consumer_key
    , params.consumer_secret
    , config.oauth.version
    , null 
    , config.oauth.method
    , null
    , {
      }
  );

  this.oa.access_token_key = params.access_token_key;
  this.oa.access_token_secret = params.access_token_secret;
};

/*
 * API calls
 *
 * @param {String} url: resource url
 * @param {Object} params: resource params
 * @param {Function} callback: callback funcion
 */

Tuiter.prototype.request = function(method, url, params, is_stream, callback) {
  request(method, url)
  .sign(this.oa, this.oa.access_token_key, this.oa.access_token_secret)
  .buffer(is_stream)
  .send(params)
  .set('Accept', '*/*')
  .set('User-Agent', 'Tuiter v' + Tuiter.version)
  .set('Accept-Encoding', 'deflate, gzip')
  .end(function(res){
    if(res.ok) callback(null, res.body);
    else callback(res.text, res.body);
  });
};
