
/*
 * Module dependencies
 */

var Tuiter = require('../')
  , keys = require('./keys.json')
  , should = require('should');

var t;

describe('streaming', function(){

  before(function(done){
    t = new Tuiter(keys);
    done();
  });

  describe('#filter()', function(){
    it('should stream tweets about twitter', function(done){
      var tweetsReceived = 0
        , timeout = 5000
        , stream;
      setTimeout(function(){
        stream.destroy();
      }, timeout);
      t.filter({ track: 'twitter' }, function(s) {
        stream = s;
        stream.on('tweet', function(status) {
          ++tweetsReceived;
        });
        stream.on('delete', function(status, error) {
          
        });
        stream.on('error', function(status) {
          throw new Error('[Stream] Error ' + status.code + ': ' + status.description);
        });
        stream.on('end', function(response) {
          //console.log('[Stream] Disconnected from Twitter, received ' + tweetsReceived + ' tweets in ' + timeout / 1000 + ' seconds.');
          done();
        });
      });
    });
  });
});
