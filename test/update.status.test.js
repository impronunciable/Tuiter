
/*
 * Module dependencies
 */

var Tuiter = require('../')
  , keys = require('./keys.json')
  , should = require('should');

var t;

describe('search', function(){

  before(function(done){
    t = new Tuiter(keys);
    done();
  });

  describe('#update()', function(){
    it('should update the status adding a new twitt', function(done){
      var status = 'Twitting  ([{!@#$%^&*`~-=_+;\':"<>,.?/}]) - ' + new Date();
      t.update({ status: status }, function(err, data){
        if(err) throw err;

        data.should.exists;
        done();
      });
    });
  });
});
