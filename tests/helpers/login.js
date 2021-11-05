import { registerAsyncHelper } from '@ember/test';

/**
 * Authenticates the session as:
 *
 *  - the "normal" test user, or
 *    (test@civocracy.org)
 *
 *  - the "issue admin" test user
 *    (#42 - superdupertestuser@civocracy.org)
 *
 */
export default registerAsyncHelper('login',
	function(app, asAdmin) {
		click('.btn-login') ;
		if (asAdmin) {
			fillIn('input.email', 'superdupertestuser@civocracy.org') ;
			fillIn('input.password', 'test') ;
		} else {
			fillIn('input.email', 'test@civocracy.org') ;
			fillIn('input.password', 'test') ;
		}
		click('button[type="submit"]') ;
	}
) ;

