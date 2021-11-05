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

  test('User can visit the issue page from an external link like https://www.civocracy.org/discussions/42', function (assert) {
      assert.expect(3) ;
      visit('/discussions/42') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'issue.learn.index', 'The route to issue.learn.index page currently active') ;
          assert.equal(currentPath(), 'issue.learn.index', 'The current path is "issue.learn.index"') ;
          assert.equal(currentURL(), '/discussions/42/learn', 'The current URL is "/discussions/42/learn"') ;
          findWithAssert('.issue-introduction') ;
          findWithAssert('.link-list') ;
      }) ;
  }) ;

  test('User can visit the issue/learn section', function (assert) {
      assert.expect(3) ;
      visit('/discussions/42/learn') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'issue.learn.index', 'The route to issue.learn.index page currently active') ;
          assert.equal(currentPath(), 'issue.learn.index', 'The current path is "issue.learn.index"') ;
          assert.equal(currentURL(), '/discussions/42/learn', 'The current URL is "/discussions/42/learn"') ;
          findWithAssert('.issue-introduction') ;
          findWithAssert('.link-list') ;
      }) ;
  }) ;

  test('User can visit the issue/act section', function (assert) {
      assert.expect(3) ;
      visit('/discussions/42/act') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'issue.act.index', 'The route to issue.act.index page currently active') ;
          assert.equal(currentPath(), 'issue.act.index', 'The current path is "issue.act.index"') ;
          assert.equal(currentURL(), '/discussions/42/act', 'The current URL is "/discussions/42/act"') ;
          findWithAssert('#issueComments') ;
          findWithAssert('#newActionForm') ;
      }) ;
  }) ;
});
