
/*
 * Module dependencies
 */ 

var request = require('./request')
  , rest = require('./endpoints/rest.json')
  , streaming = require('./endpoints/streaming.json')
  , utils = require('./utils');

/*
 * Constructor
 *
 * @param {Object} oauth_params: OAuth settings
 * @return {Object} new instance
 */ 

function Tuiter(oauth_params){
  request.oauth.call(this, oauth_params);
  return this;
}

/*
 * Version
 */

Tuiter.version = '0.1.6';

/*
 * Expose constructor
 */ 

var exports = module.exports = Tuiter;

/*
 * Utils (I prefer util but ryah took it)
 */ 

require('./utils');


module.exports = function(oauth_params){
  if(oauth_params) return new Tuiter(oauth_params);
  else return Tuiter;
};

/*
 * Augment Tuiter prototype with REST method
 */

Object.keys(rest).forEach(function(key){
  var method = rest[key].resource;
  Tuiter.prototype[key] = function(params, callback){
    if("function" == typeof params){
      callback = params;
      params = {};
    }
    params = params || {};
    method = utils.preprocess(method, params);
    request.request.call(this, rest[key].method, method, params, false, callback);
    return this;
  };
});

/*
 * Augment Tuiter prototype with Streaming methods
 */

Object.keys(streaming).forEach(function(key){
  var method = streaming[key].resource;
  Tuiter.prototype[key] = function(params, callback){
    if("function" == typeof params){
      callback = params;
      params = {};
    }
    params = params || {};
    method = utils.preprocess(method, params);
    request.request.call(this, streaming[key].method, method, params, true, callback);
    return this;
  };
});


