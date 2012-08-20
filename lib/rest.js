
/*
 * Module dependencies
 */ 

var Tuiter = module.parent.exports
  , utils = require('./utils')
  , rest = require('./endpoints/rest.json')

/*
 * Create REST API methods with convenient names from endpoints/rest.json file
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
    this.request(rest[key].method, method, params, false, callback);
    return this;
  };
});
