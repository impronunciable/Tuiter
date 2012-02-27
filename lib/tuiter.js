function Tuiter(oauth_params){
	this.oauth(oauth_params);

	return this;
}

var exports = module.exports = Tuiter;

require('./request');
require('./search');
require('./rest');
