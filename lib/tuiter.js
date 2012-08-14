
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
 * Version
 */

Tuiter.version = '0.1.5';

/*
 * Expose constructor
 */ 

var exports = module.exports = Tuiter;

/*
 * Utils (I prefer util but ryah took it)
 */ 

require('./utils')

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
