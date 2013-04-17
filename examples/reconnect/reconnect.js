
var tuiter = require('../../')(require('./keys.json'));

var stream;

tuiter.filter({track: ['goal', 'free kick']}, function(res) {
  stream = res;
  res.on('tweet', function(tweet){console.log(tweet);})
  res.on('error', function(e){console.log(e);})
});

//setTimeout(stream.emit.bind(stream, {track: 'messi'}),  10000);
