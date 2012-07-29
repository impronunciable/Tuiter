# Tuiter

Tuiter is a Node.JS library that makes the interaction with the Twitter API easy.

## How to install

    npm install tuiter

## How to use

Require Tuiter

    var Tuiter = require('tuiter');

Create a Tuiter object with your [Twitter application keys](https://dev.twitter.com/apps/new)
 
    var tu = new Tuiter({
        "consumer_key" : "blablabla"
      , "consumer_secret" : "blablabla" 
      , "access_token_key" : "blablabla"
      , "access_token_secret" : "blablabla"
    });

Use the api methods as you want, for example:
 
    tu.mentions({trim_user: false}, function(err, data){
      console.log(data);	
    });

Using the Streaming is a little different:

    tu.filter({track: ['soccer','pokemon']}, function(stream){

      // tweets :)
      stream.on('tweet', function(data){
        console.log(data);
      });

    });

If you want to restart the Streaming API connection you can use:

    tu.filter({track: "pizza"}, function(stream){

      setTimeout(function(){      
        stream.emit('restart', {follow: "314159"});
      }, 10000);

    });

You can also finish the connection: 

    tu.filter({track: "milanesa"}, function(stream){

      setTimeout(function(){      
        stream.emit('end');
      }, 2 * 3 * 4);

    });

## Showcase

You can find Projects and demos using Tuiter [here](http://zajdband.com.ar/tuiter-showcase.html)

## Features

+ All API methods available
+ Automatic reconnection for Streaming API calls
+ Gzip compression
+ Params preprocessing: Locations as {lat: num,long:num } arrays, allow array params
+ API HTTP Error handling
+ Paging for REST API
+ Custom results for Search API

## Available methods

All Search API, REST API and Streaming API methods are available. The names of the methods in the library are up-to-date [inside the code](https://github.com/danzajdband/Tuiter/blob/master/lib/config.json)

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
