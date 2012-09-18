
var tuiter = require('../../')(require('./keys.json'))
  , fs = require('fs');

var output = fs.createWriteStream(__dirname + '/output.txt');

tuiter.sample(function(stream){
  stream.pipe(output);
});
