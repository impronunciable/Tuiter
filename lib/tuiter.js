
/*
 * Module dependencies
 */ 

/*
 * Constructor
 *
 * @param {Object} oauth_params: OAuth settings
 * @return {Object} new instance
 */ 

function Tuiter(oauth_params){
	this.oauth(oauth_params);

	return this;
}

/*
 * Expose constructor
 */ 

var exports = module.exports = Tuiter;

/*
 * API calls module
 */ 

require('./request');

/*
 * Search API module
 */ 

require('./search');

/*
 * REST API module
 */ 

require('./rest');

/*
 * Streaming API module
 */ 

require('./streaming');
