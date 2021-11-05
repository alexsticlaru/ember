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

  test('User can visit the team page', function(assert) {
    visit('/team');

    andThen(function() {
      assert.equal(currentRouteName(), 'team', 'The route to team page currently active');
      assert.equal(currentPath(), 'team', 'The current path is "team"');
      assert.equal(currentURL(), '/team', 'The current URL is "/team"');
    });
  });
});

