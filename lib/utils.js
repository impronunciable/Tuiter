
/*
 * Module dependencies
 */ 

var util = require('util');

/*
 * Convert params to strings
 *
 * @param {Object}
 */ 

exports.preprocess = function(params){
  if("object" == typeof params){
    for(var i in params){
      if(i == 'locations' && util.isArray(params[i])){
			  params[i].forEach(function(loc){
				  loc = loc.long + ',' + loc.lat;
				});
			}

	    if(util.isArray(params[i])){
        params[i] = params[i].join(',');
  		}
  	}
  }
};
