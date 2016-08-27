# Tuiter

Tuiter is a Node.JS library that makes the interaction with the Twitter API easy.

## How to install

```bash
    npm install tuiter
```

## How to use

Create a Tuiter object with your [Twitter application keys](https://dev.twitter.com/apps/new)

```js
    var keys = {
        "consumer_key" : "blablabla"
      , "consumer_secret" : "blablabla" 
      , "access_token_key" : "blablabla"
      , "access_token_secret" : "blablabla"
    };

    var tu = require('tuiter')(keys);
```

Use the api methods as you want, for example:
 
```js
    tu.mentionsTimeline({trim_user: true}, function(err, data){
      console.log(data);	
    });
```

Using the Streaming is a little different:

```js
    tu.filter({track: ['soccer','pokemon']}, function(stream){
      // tweets :)
      stream.on('tweet', function(data){
        console.log(data);
      });
    });
```

It is possible to use lat, long objects for describing location bounding boxes:

```js
    tu.filter({locations: [{lat: -90, long: -180}, {lat: 90, long: 180}]}, function(stream){
      // tweets :)
      stream.on('tweet', function(data){
        console.log(data);
      });
    });
```

Streaming API Calls reconnect automatically but you can finish the connection manually: 
```js
    tu.filter({track: "milanesa"}, function(stream){

      setTimeout(function(){      
        stream.emit('end');
      }, 2 * 3 * 4);
    });
```

API Call responses are Stream objects so you can pipe (for example to a file):

```js
    var output = fs.createWriteStream(__dirname + '/output.txt');

    tuiter.sample(function(stream){
      stream.pipe(output);
    });
```

Although you can explicitly reconnect using other params
```js
    var st;
    tu.filter({track: "milanesa"}, function(stream){
      stream = st;
    });

    setTimeout(function(){      
      st.emit('reconnect', {track: ["ketchup", "papas fritas"]});
    }, 2 * 3 * 4);
```

## Showcase

You can find Projects and demos using Tuiter [here](http://zajdband.com.ar/tuiter-showcase.html)

## Features

+ All API methods available (Including REST API 1.1): [https://github.com/danzajdband/Tuiter/wiki/API-Methods] (https://github.com/danzajdband/Tuiter/wiki/API-Methods)
+ Automatic reconnection for Streaming API calls
+ Explicit stream reconnection with argument passing
+ Gzip compression
+ Params preprocessing: Locations as {lat: num,long:num } arrays, allow array params

## Available methods

All Search API, REST API V1.1 and Streaming API methods are available. The names of the methods in the library are listed [Here](https://github.com/danzajdband/Tuiter/wiki/API-Methods)

## Test

Add your development keys in test/keys.json file like as the follow lines:

```js
    var keys.json = {
        "consumer_key" : "6ffkyGE7aWgHyOXVAlzZA"
      , "consumer_secret" : "UFiyaFW9RPSacY7547jlIvk9E6Jn07StbgrDkdtKV8" 
      , "access_token_key" : "308711490-N62VGRYIvNPgBsqDV0nDW491J9q7GJsXqTHm4JpM"
      , "access_token_secret" : "QVXnxCI7vO3wtkbxBfMfsDZWHCQX23DipMMTObmak"
    };
```

Download testing modules dependencies

    npm install

Run tests

    make test

## License 

(The MIT License)

Copyright (c) 2012 Dan Zajdband &lt;dan.zajdband@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
