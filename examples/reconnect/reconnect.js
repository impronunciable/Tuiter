
var tuiter = require('tuiter')(require('./keys.json'));

var stream;

tuiter.filter({track: ['goal', 'free kick']}, function(res) {
  stream = res;

  res.on('tweet', function(tweet.text){console.log(tweet.text);})
});

setTimeout(stream.emit.bind(stream, {track: 'messi'}),  10000);
