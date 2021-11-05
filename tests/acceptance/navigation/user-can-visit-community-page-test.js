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

  test('User can visit the community page from an external link like https://www.civocracy.org/test', function (assert) {
      assert.expect(3) ;
      visit('/test') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'community.index', 'The route to community.index page currently active') ;
          assert.equal(currentPath(), 'community.index', 'The current path is "community.index"') ;
          assert.equal(currentURL(),
              '/test',
              'The current URL is "/test"'
          ) ;
          setTimeout(function() {
              findWithAssert('.issue-list') ;
          }, 5000) ;
          findWithAssert('.proposition-list') ;
          findWithAssert('.update-list') ;
      }) ;
  }) ;

  test('User can visit the community/discussions/official section', function (assert) {
      assert.expect(3) ;
      visit('/test/discussions/official') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'community.discussions.official', 'The route to community.discussions.official page currently active') ;
          assert.equal(currentPath(), 'community.discussions.official', 'The current path is "community.discussions.official"') ;
          assert.equal(currentURL(),
              '/test/discussions/official',
              'The current URL is "/test/discussions/official"'
          ) ;
          findWithAssert('.issue-list') ;
      }) ;
  }) ;

  test('User can visit the community/discussions/citizen section', function (assert) {
      assert.expect(3) ;
      visit('/test/discussions/citizen') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'community.discussions.citizen', 'The route to community.discussions.citizen page currently active') ;
          assert.equal(currentPath(), 'community.discussions.citizen', 'The current path is "community.discussions.citizen"') ;
          assert.equal(currentURL(),
              '/test/discussions/citizen',
              'The current URL is "/test/discussions/citizen"'
          ) ;
          findWithAssert('.issue-list') ;
      }) ;
  }) ;

  test('User can visit the community/followers section', function (assert) {
      assert.expect(3) ;
      visit('/test/followers') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'community.followers', 'The route to community.followers page currently active') ;
          assert.equal(currentPath(), 'community.followers', 'The current path is "community.followers"') ;
          assert.equal(currentURL(),
              '/test/followers',
              'The current URL is "/test/followers"'
          ) ;
          findWithAssert('.followers .follower') ;
      }) ;
  }) ;

  test('User can visit the community/updates section', function (assert) {
      assert.expect(3) ;
      visit('/test/updates') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'community.updates', 'The route to community.updates page currently active') ;
          assert.equal(currentPath(), 'community.updates', 'The current path is "community.updates"') ;
          assert.equal(currentURL(),
              '/test/updates',
              'The current URL is "/test/updates"'
          ) ;
          findWithAssert('.update-list') ;
      }) ;
  }) ;

  test('User can visit the community/propositions section', function (assert) {
      assert.expect(3) ;
      visit('/test/propositions') ;

      andThen( function () {
          assert.equal(currentRouteName(), 'community.propositions.index', 'The route to community.propositions.index page currently active') ;
          assert.equal(currentPath(), 'community.propositions.index', 'The current path is "community.propositions.index"') ;
          assert.equal(currentURL(),
              '/test/propositions',
              'The current URL is "/test/propositions"'
          ) ;
          findWithAssert('.proposition-list') ;
      }) ;
  }) ;
});
