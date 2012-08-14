
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
    if(rest[key].method == "get") {
      this.get(method, params, callback);
    } else if(rest[key].method == "post") {
      this.post(method, params, callback);
    }

    this.last_request = {
        "method" : key
      , "params" : params
      , "url" : method
      , "callback" : callback
    };

    return this;
  };
});


/*
 * Next page
 */

Tuiter.prototype.next = function(callback){
  var last = this.last_request;
  last.params.page++;
  if("function" == typeof callback){
    this[last.method](last.params, callback);
  } else {
    this[last.method](last.params, last.callback);
  }

  return this;
};

/*
 * Previous page
 */

Tuiter.prototype.prev = function(callback){
  var last = this.last_request;
  last.params.page--;
  if("function" == typeof callback){
    this[last.method](last.params, callback);
  } else {
    this[last.method](last.params, last.callback);
  }

  return this;
};
