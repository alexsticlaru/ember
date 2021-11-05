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

  test('User can visit the home page', function(assert) {
    visit('/');

    andThen(function() {
      assert.equal(currentRouteName(), 'home.index', 'The route to home page currently active');
      assert.equal(currentPath(), 'home.index', 'The current user path is: ->home');
      assert.equal(currentURL(), '/', 'The current URL is "/"');
       findWithAssert('input.autocomplete-input:visible') ;
    });
  });
});

