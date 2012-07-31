
/*
 * Module dependencies
 */ 

var util = require('util');

/*
 * Convert params to strings
 *
 * @param {String}
 * @param {Object}
 */ 

exports.preprocess = function(method, params){

  if(params && util.isArray(params['locations'])){
    params['locations'] =  params['locations'].map(function(el){
      return el.long + ',' + el.lat;
    });
  }

  for(var i in params)
    if(util.isArray(params[i])) 
      params[i] = params[i].join(',');

  return replaceUrl(method, params);
};

/*
 * Replace url params
 *
 * @param {String}
 * @param {Object}
 */ 

var url_params = ['id','screen_name','slug','woeid','place_id'];

var replaceUrl = function(method, params){
  var keys = Object.keys(params);

  if(keys.length){
    keys.forEach(function(key){
      if(-1 != url_params.indexOf(key)){
        method = method.replace(':' + key, params[key]);
      }
    });
  }

  return method;
};
