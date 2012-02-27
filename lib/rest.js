
/*
 * Module dependencies
 */ 

var parent = module.parent.exports
	, config = require('./config.json');

/*
 * Create REST API GET methods with convenient names from config.json file
 */ 

Object.keys(config.rest.get).forEach(function(key){
	parent.prototype[key] = function(params, callback){
		var method = config.rest.get[key].replace(':id', params.id);
		method = method.replace(':screen_name', params.screen_name);
		method = method.replace(':slug', params.slug);
		this.get(method, params, callback);

		return this;
	};
});

/*
 * Create REST API POST methods with convenient names from config.json file
 */ 

Object.keys(config.rest.get).forEach(function(key){
	parent.prototype[key] = function(params, callback){
		var method = config.rest.post[key].replace(':id', params.id);
		method = method.replace(':screen_name', params.screen_name);
		method = method.replace(':slug', params.slug);
		this.post(method, params, callback);

		return this;
	};
});
