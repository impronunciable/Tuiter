
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
        , timeout = 3500
        , stream;
      setTimeout(function(){
        stream.emit('end');
        var listeners = stream.listeners('tweet').length === 0;
        listeners.should.be.ok;
        done();
      }, timeout);
      t.filter({ track: 'twitter' }, function(s) {
        stream = s;
        stream.on('tweet', function(status) {
          ++tweetsReceived;
        });
        stream.on('delete', function(status, error) {
          
        });
        stream.on('error', function(status) {
        });
      });
    });
  });
});
