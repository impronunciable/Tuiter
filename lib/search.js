
/*
 * Module dependencies
 */

var Tuiter = module.parent.exports
  , config = require('./config.json');

/*
 * API search method
 *
 * @param {Object} params: search params
 * @param {Function} callback: callback function
 * @return {Object}
 */

Tuiter.prototype.search = function(params, callback){
  this.get(config.search.url, params, callback);
  return this;
};
