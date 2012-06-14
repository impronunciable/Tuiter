
/*
 * Module dependencies
 */

var Tuiter = require('../')
  , keys = require('./keys.json')
  , methods = require('../lib/config.json').rest;

var t;

describe('rest', function(){

  before(function(done){
    t = new Tuiter(keys);
    done();
  });


  describe('#homeTimeline()', function(){
    it('should return latest tweets from logged in user timeline', function(done){
      t.homeTimeline({'include_rts' : false}, function(err, data){
        if(err) throw err;
        data.should.exists;
        "object".should.equal(typeof data);
        done();
      });
    });
  });

});
