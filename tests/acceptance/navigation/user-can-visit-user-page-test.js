import { run } from '@ember/runloop';

import {
	module,
	test,
} from 'qunit' ;

import startApp from 'civ/tests/helpers/start-app' ;

var application ;

module('Acceptance | Navigation', function(hooks) {
  hooks.beforeEach(function () {
      application = startApp() ;
  });

  hooks.afterEach(function () {
      run(application, 'destroy') ;
  });

  test('User can visit the user page from an external link like https://www.civocracy.org/u/42/test', function (assert) {
      assert.expect(3) ;
      visit('/u/42/test') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'user.index', 'The route to user.index page currently active') ;
          assert.equal(currentPath(), 'user.index', 'The current path is "user.index"') ;
          assert.equal(currentURL(), '/u/42/test', 'The current URL is "/u/42/test"') ;
          findWithAssert('.user-info') ;
          findWithAssert('.badges-box') ;
      }) ;
  }) ;

  /*
   * FIXME: needs valid test token
   *
  test('User can visit the user/subscribe section', function (assert) {
      assert.expect(3) ;
      visit('/u/42/test/subscribe?type=issue_communityfollowing_new&token=zbla') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'user.subscribe', 'The route to user.subscribe page currently active') ;
          assert.equal(currentPath(), 'user.subscribe', 'The current path is "user.subscribe"') ;
          assert.equal(currentURL(),
              '/u/42/test/subscribe?type=issue_communityfollowing_new&token=zbla',
              'The current URL is "/u/42/test/subscribe?type=issue_communityfollowing_new&token=zbla"'
          ) ;
      }) ;
  }) ;

  test('User can visit the user/unsubscribe section', function (assert) {
      assert.expect(3) ;
      visit('/u/42/test/unsubscribe?type=issue_communityfollowing_new&token=zbla') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'user.unsubscribe', 'The route to user.unsubscribe page currently active') ;
          assert.equal(currentPath(), 'user.unsubscribe', 'The current path is "user.unsubscribe"') ;
          assert.equal(currentURL(),
              '/u/42/test/unsubscribe?type=issue_communityfollowing_new&token=zbla',
              'The current URL is "/u/42/test/unsubscribe?type=issue_communityfollowing_new&token=zbla"'
          ) ;
      }) ;
  }) ;
   */

  test('User can visit the user/mails section', function (assert) {
      assert.expect(3) ;
      visit('/') ;

      login() ;

      visit('/u/42/test/mails') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'user.mails', 'The route to user.mails page currently active') ;
          assert.equal(currentPath(), 'user.mails', 'The current path is "user.mails"') ;
          assert.equal(currentURL(), '/u/42/test/mails', 'The current URL is "/u/42/test/mails"') ;
          findWithAssert('.infos-form') ;
          findWithAssert('.email-option') ;
      }) ;
  }) ;
});
