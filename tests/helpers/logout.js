import { registerAsyncHelper } from '@ember/test';

/**
 * Authenticates the session as the test user (#42).
 */
export default registerAsyncHelper('logout', function(app, assert, name, context) {
	//click('a[href="#user"]') ;
	//click('a[href="#logout"]') ;
	//click('a#test-logout-trigger') ;
	click('#m-menu a#btn-logout');
}) ;

