var parent = module.parent.exports
	, config = require('./config.json');

parent.prototype.search = function(params, callback){
	this.get(config.search.url, params, callback);
	return this;
};
