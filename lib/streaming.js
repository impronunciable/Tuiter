
/*
 * Module dependencies
 */

var parent = module.parent.exports
	, config = require('./config.json');

/*
 * Create Streaming API GET methods with convenient names from config.json file
 */ 

Object.keys(config.streaming.get).forEach(function(key){
	parent.prototype[key] = function(params, callback){
		var method = config.streaming.get[key];
		this.getStream(method, params, callback);
		return this;
	};
});

/*
 * Create Streaming API POST methods with convenient names from config.json file
 */ 

Object.keys(config.streaming.post).forEach(function(key){
	parent.prototype[key] = function(params, callback){
		var method = config.streaming.post[key];
		this.postStream(method, params, callback);
		return this;
	};
});
