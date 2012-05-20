
/*
 * Module dependencies
 */

var Tuiter = require('../')
  , keys = require('./keys.json');

var t;

describe('search', function(){

  before(function(done){
    t = new Tuiter(keys);
    done();
  });

  describe('#search()', function(){
    it('should get tweets about messi', function(done){
      t.search({q: 'messi'}, function(err, data){
        if(err) throw err;
        data.should.exists;
        done();
      });
    });
  });

});
