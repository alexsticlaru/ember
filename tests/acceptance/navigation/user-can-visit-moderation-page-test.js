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

  test('User can visit the moderation page', function(assert) {
    visit('/moderation');

    andThen(function() {
      assert.equal(currentRouteName(), 'moderation', 'The route to moderation page currently active');
      assert.equal(currentPath(), 'moderation', 'The current path is "moderation"');
      assert.equal(currentURL(), '/moderation', 'The current URL is "/moderation"');
    });
  });
});

