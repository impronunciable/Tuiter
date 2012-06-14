
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
  if("object" == typeof params){
    for(var i in params){
      if(i == 'locations' && util.isArray(params[i])){
			  for(var j in params[i]){
				  params[i][j] = params[i][j].long + ',' + params[i][j].lat;
				}
      }			

	    if(util.isArray(params[i])){
        params[i] = params[i].join(',');
  		}
  	}
  }

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

  Object.keys(params).forEach(function(key){
    if(-1 != url_params.indexOf(key)){
       method = method.replace(':' + key, params[key]);
       delete params[key];
    }

  });

  return method;
};
