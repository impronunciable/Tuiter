
/*
 * Module dependencies
 */

var Tuiter = require('../')(require('./keys.json'))
  , methods = require('../lib/endpoints.json')
  , should = require('should');

describe('rest', function(){

  before(function(done){
    done();
  });

  describe('#homeTimeline()', function(){
    it('should return latest tweets from logged in user timeline', function(done){
      Tuiter.homeTimeline({ 'include_entities' : true }, function(err, data){
        err.should.not.be.ok;
        should.exist(data);
        "object".should.equal(typeof data);
        done();
      });
    });
  });

  describe('#show()', function(){
    it('should return extended information about 209401805203976192 tweet', function(done){
      Tuiter.show({ 'id' :'213359699771392002' }, function(err, data){
        err.should.not.be.ok;
        data.should.be.ok;
        "object".should.equal(typeof data);
        done();
      });
    });
  });

  describe('#showUser()', function(){
    it('should return extended information about @dzajdband', function(done){
      Tuiter.showUser({ 'screen_name': 'dzajdband' }, function(err, data){
        err.should.not.be.ok;
        data.should.be.ok;
        "dzajdband".should.equal(data.screen_name);
        done();
      });
    });
  });

  describe('#retweets()', function(){
    it('should return latest retweets to 209401805203976192 tweet', function(done){
      Tuiter.retweets({ 'id' : '213359699771392002' }, function(err, data){
        err.should.not.be.ok;
        data.should.be.ok;
        "object".should.equal(typeof data);
        done();
      });
    });
  });

});
