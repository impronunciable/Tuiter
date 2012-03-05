
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
      if(i == 'locations' && "object" == typeof params[i]){
			  var loc_arr = [];
			  for(var j in params[i]){
				  loc_arr.push(params[i][j].long);
					loc_arrpush(params[i][j].lat);
				}
				params[i] = loc_arr;
			}

	    if(util.isArray(params[i])){
        params[i] = params[i].join(',');
  		}
  	}
  }
};
