
/*
 * Module dependencies
 */

var Tuiter = module.parent.exports
  , utils = require('./utils')
  , streaming = require('./endpoints/streaming.json');

/*
 * Create Streaming API GET methods with convenient names from endpoints/streaming.json file
 */ 

Object.keys(streaming).forEach(function(key){
  var method = streaming[key];

  Tuiter.prototype[key] = function(params, callback){
    if("function" == typeof params){
      callback = params;
      params = {};
    }

    params = params || {};

    utils.preprocess(method, params);

    if(streaming[key].method === "get") { 
      this.getStream(method.resource, params, callback);
    } else if(streaming[key].method === "post") {
      this.postStream(method.resource, params, callback);
    }

    return this;
  };
});
