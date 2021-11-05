import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from 'civ/tests/helpers/start-app';

var application;

module('Acceptance | Navigation', function(hooks) {
  hooks.beforeEach(function() {
    application = startApp();
  });

  hooks.afterEach(function() {
    run(application, 'destroy');
  });

  test('User can visit the terms-and-conditions page', function(assert) {
    visit('/terms-and-conditions');

    andThen(function() {
      assert.equal(currentRouteName(), 'terms-and-conditions', 'The route to terms-and-conditions page currently active');
      assert.equal(currentPath(), 'terms-and-conditions', 'The current path is "terms-and-conditions"');
      assert.equal(currentURL(), '/terms-and-conditions', 'The current URL is "/terms-and-conditions"');
       findWithAssert('.terms-and-conditions') ;
    });
  });
});

