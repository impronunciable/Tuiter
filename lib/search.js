
/*
 * Module dependencies
 */

var Tuiter = module.parent.exports
  , search = require('./endpoints/search.json');

/*
 * API search method
 *
 * @param {Object} params: search params
 * @param {Function} callback: callback function
 * @return {Object}
 */

Tuiter.prototype.search = function(params, callback){
  var self = this
    , result_count = params.result_count || 0
    , since_id_str = params.since_id_str || '0';

  this.get(search.search.resource, params, function getLoop(err, data){
    if(err) return callback(err, data);
    if(data.results && params.result_count > 0 && data.results.length > result_count) 
      data.results.splice(result_count, data.results.length);

    callback(err, data);
    result_count -= data.results.length;
    params.since_id_str = data.max_id_str;

    if(result_count > 0){
      self.get(search.search.resource, params, getLoop);
    }

  });
  return this;
};
