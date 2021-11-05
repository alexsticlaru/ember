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

  test('User can visit the services page', function(assert) {
    visit('/services');

    andThen(function() {
      assert.equal(currentRouteName(), 'services', 'The route to services page currently active');
      assert.equal(currentPath(), 'services', 'The current path is "services"');
      assert.equal(currentURL(), '/services', 'The current URL is "/services"');
    });
  });
});

