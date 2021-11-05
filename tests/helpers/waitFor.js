import { later } from '@ember/runloop';
import { registerAsyncHelper } from '@ember/test';
import config from "../../config/environment";

var APP_TIMEOUT = config.APP.defaultWaitForTimeout;
var DEFAULT_TIMEOUT = APP_TIMEOUT !== undefined ? APP_TIMEOUT : 500;

/**
 * wait for 5 seconds
 */
export default registerAsyncHelper('waitFor', function(app, assert, callback, timeout) {
	timeout = timeout || DEFAULT_TIMEOUT;

	var done = assert.async();
	later(function(){
		callback();
		done();
	}, timeout);
}) ;

