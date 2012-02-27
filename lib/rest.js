var parent = module.parent.exports
	, config = require('./config.json');

Object.keys(config.rest.get).forEach(function(key){
	parent.prototype[key] = function(params, callback){
		this.get(config.rest.get[key].replace(':id', params.id), params, callback);
	};
});

//for(var method in config.rest.get){
//	parent.prototype[method] = function(params, callback){
//		this.post(config.rest.get[method].replace(':id', params.id), params, callback);
//	};
//}
