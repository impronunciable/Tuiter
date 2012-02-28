
/*
 * Module dependencies
 */

var OAuth = require('oauth').OAuth
	, parent = module.parent.exports
	, qs = require('querystring')
	, config = require('./config.json');

/*
 * Auth
 *
 * @param {Obejct} params: OAuth params
 */ 

parent.prototype.oauth = function(params){
	params.consumer_key = params.consumer_key || null;
	params.consumer_secret = params.consumer_secret || null;
	params.callback_url = params.callback_url || "http://localhost:3000/oauth/callback";

	this.oa = new OAuth(config.oauth.request_token_url, config.oauth.access_token_url, params.consumer_key, params.consumer_secret, config.oauth.version, null, config.oauth.method);

	this.oa.access_token_key = params.access_token_key;
	this.oa.access_token_secret = params.access_token_secret;
};

/*
 * API calls GET method
 *
 * @param {String} url: resource url
 * @param {Object} params: resource params
 * @param {Function} callback: callback funcion
 */

parent.prototype.get = function(url, params, callback){
	this.oa.get(url + '?' + qs.stringify(params), this.oa.access_token_key, this.oa.access_token_secret, function(err, data){
		try{
			data = JSON.parse(data);
		} catch(e){
			throw e;
		}
		callback(err, data);
	});
};

/*
 * API calls POST method
 *
 * @param {String} url: resource url
 * @param {Object} params: resource params
 * @param {Function} callback: callback funcion
 */

parent.prototype.post = function(url, params, callback){
	this.oa.post(url, this.oa.access_token_key, this.oa.access_token_secret, params, function(err, data){
		try{
			data = JSON.parse(data);
		} catch(e){
			throw e;
		}
		callback(err, data);
	});
};

parent.prototype.getStream = function(url, params, callback){
	var req = this.oa.get(url + '?' + qs.stringify(params), this.oa.access_token_key, this.oa.access_token_secret);
	var buf = '';

	req.on('response', function(res){
		res.setEncoding('utf-8');
		res.on('data', function(chunk){
			buf += chunk;
			if(buf.indexOf('\r') !== -1){
				buf = buf.replace('\r\n','');
				buf = buf.replace('\r','');
				try{
					var json_stream = JSON.parse(buf);
					res.emit('stream data', json_stream);
				} catch(e){
					console.log('error');
					console.log(buf.indexOf('\r\n'));
					console.log(buf.length);
				}
				buf = '';
			}
		});
		callback(res);
	});
	req.end();
	
	return this;
};

parent.prototype.postStream = function(url, params, callback){
};
