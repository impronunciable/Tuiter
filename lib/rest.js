
/*
 * Module dependencies
 */ 

var Tuiter = module.parent.exports
  , config = require('./config.json');

/*
 * Request url params
 */

var url_params = ['id','screen_name','slug','woeid','place_id'];

/*
 * Create REST API GET methods with convenient names from config.json file
 */ 

Object.keys(config.rest.get).forEach(function(key){
  Tuiter.prototype[key] = function(params, callback){
    params.page = params.page || 1;
    var method = config.rest.get[key];
    url_params.forEach(function(param){
      method = method.replace(':' + param, '');
    });
    this.get(method, params, callback);

    this.last_request = {
        "method" : key
      , "params" : params
      , "url" : config.rest.get[key]
      , "callback" : callback
    };

    return this;
  };
});

/*
 * Create REST API POST methods with convenient names from config.json file
 */ 

Object.keys(config.rest.post).forEach(function(key){
  Tuiter.prototype[key] = function(params, callback){
    var method = config.rest.post[key];
    url_params.forEach(function(param){
      method = method.replace(':' + param, '');
    });
    this.post(method, params, callback);

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
