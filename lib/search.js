
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
  var self = this
    , result_count = params.result_count || 0
    , since_id_str = params.since_id_str || '0';

  this.get(config.search.url, params, function getLoop(err, data){
    if(data.results && params.result_count > 0 && data.results.length > result_count) data.results.splice(result_count, data.results.length);
    callback(err, data);

    if(!err){
      result_count -= data.results.length;
      params.since_id_str = data.max_id_str;
    }
    if(!err && result_count > 0){
      self.get(config.search.url, params, getLoop);
    }
  });
  return this;
};


