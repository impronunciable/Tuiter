
/*
 * Module dependencies
 */

var t = require('../')(require('./keys.json'))
  , should = require('should');

var t;

describe('streaming', function(){

  describe('#filter()', function(){
    it('should stream tweets about twitter', function(done){
      var tweetsReceived = 0
        , timeout = 3500
        , stream;
      setTimeout(function(){
        stream.end();
        var listeners = stream.listeners('tweet').length === 0;
        listeners.should.be.ok;
        stream.emit('end');
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

  describe('#reconnect', function(){
    it('should stream about hate and after 2.5 sec start streaming about love', function(done){
      var st, is_love = false;

      t.filter({track: 'hate'}, function(stream){
        st = stream;

        stream.on('tweet', function(tweet){ 
          if(tweet.text.indexOf('love') != -1) is_love = true;
        });
      });

      setTimeout(st.emit.bind(st, 'reconnect', {track: 'love'}), 2500);
      setTimeout(function(){
        st.emit('end'); 
        is_love.should.be.ok;
        done();
      }, 5000);
    });
  });
});
