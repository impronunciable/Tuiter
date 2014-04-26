==================
0.2.12 / 2014-04-26

  * Changed "statuses/filter" method from POST to GET.


==================
0.2.11 / 2013-09-03

  * Updated superagent dependency 


==================
0.2.10 / 2013-07-04

  * Fixes on error and reconnection


==================
0.2.9 / 2013-07-04

  * Working with node v0.10.12

==================
0.2.8 / 2013-05-09

  * Fix on stream#reconnect


==================
0.2.7 / 2013-01-11

  * Fix on stream#end


==================
0.2.6 / 2012-12-13

  * Allow custom access tokens


==================
0.2.5 / 2012-12-11

  * Reconnection fixes


==================
0.2.4 / 2012-12-10

  * Added new REST API methods "friends/list" and "followers/list"


0.2.3 / 2012-11-26
==================

  * Added stream 'reconnect' & 'end' events 
  * Lib internal improvements 


0.2.2 / 2012-11-22
==================

  * Fixed superagent related memory issue for streams
  * Updated dependencies
  * Fix on compressed requests
  * special characters control
  * added debug module


0.2.1 / 2012-10-23
==================

  * Auto reconnect properly working
  * Endpoint typos


0.2.0 / 2012-09-18
==================

  * Updated to REST API 1.1
  * HTTP requests via Superagent and Superagent-oauth
  * Minimalistic code
  * Parsing via NJStream
  * Streaming response is a Stream object


0.1.6 / 2012-08-28
==================

  * Bug Fixes

0.1.5 / 2012-08-14
==================

  * Bug Fixes
  * Internal code improvements

0.1.4 / 2012-07-31
==================

  * Bug Fixes
  * Posibility to use special access tokens for each request

0.1.3 / 2012-07-26
==================

  * Streaming API restart event
  * Streaming API end event

0.1.2 / 2012-07-26
==================

  * Reconnection bug fixes

0.1.1 / 2012-07-18
==================

  * Gzipped requests  
  * Automatic reconnection support
  * Updated node-oauth to v0.9.7
  * Added Straming API limit and scrub_geo events
  * Cleaner requests

0.1.0 / 2012-06-14
==================

  * First stable version
  * All API methods available
  * Params preprocessing: Locations as {lat: num,long:num} arrays, allow array params
  * API HTTP Error handling
  * Paging for REST API
  * Custom results for Search API
