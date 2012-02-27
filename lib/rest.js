var parent = module.parent.exports
	, config = require('./config.json');

Object.keys(config.rest.get).forEach(function(key){
	parent.prototype[key] = function(params, callback){
		var method = config.rest.get[key].replace(':id', params.id);
		method = method.replace(':screen_name', params.screen_name);
		method = method.replace(':slug', params.slug);
		this.get(method, params, callback);
	};
});

Object.keys(config.rest.get).forEach(function(key){
	parent.prototype[key] = function(params, callback){
		var method = config.rest.post[key].replace(':id', params.id);
		method = method.replace(':screen_name', params.screen_name);
		method = method.replace(':slug', params.slug);
		this.post(method, params, callback);
	};
});
