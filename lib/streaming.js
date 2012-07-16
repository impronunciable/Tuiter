
/*
 * Module dependencies
 */

var Tuiter = module.parent.exports
  , utils = require('./utils')
  , config = require('./config.json');

/*
 * Create Streaming API GET methods with convenient names from config.json file
 */ 

Object.keys(config.streaming.get).forEach(function(key){
  var method = config.streaming.get[key];

  Tuiter.prototype[key] = function(params, callback){
    if("function" == typeof params){
      callback = params;
      params = {};
    }

    params = params || {};

    utils.preprocess(method, params);
    this.getStream(method, params, callback);
    return this;
  };
});

/*
 * Create Streaming API POST methods with convenient names from config.json file
 */ 

Object.keys(config.streaming.post).forEach(function(key){
  var method = config.streaming.post[key];
 
  Tuiter.prototype[key] = function(params, callback){

    if("function" == typeof params){
      callback = params;
      params = {};
    }

    params = params || {};

    utils.preprocess(method, params);
    this.postStream(method, params, callback);
    return this;
  };
});

