import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from 'civ/tests/helpers/start-app';

var application;
let session;

module('Acceptance | Login', function(hooks) {
  hooks.beforeEach(function() {
      application = startApp();
      // Prevent session restoring
      localStorage.removeItem('civocracy:session');
      // Get references to the required services
      session = application.__container__.lookup('service:session');
  });

  hooks.afterEach(function() {
      run(application, 'destroy');
  });

  test('User can login via email', function(assert) {
      assert.expect(5);

      visit('/');
      andThen(function() {
          let logout = find('#m-menu a#btn-logout');
          assert.ok(!logout.length, 'The logout button is not rendered before');
          assert.ok(!session.get('isAuthenticated'), 'The session is not authenticated before');
      });

      login() ;

      andThen(function() {
          let logout = find('#m-menu > a#btn-logout'),
            username = find('#m-menu > h3:first > span').text().trim();
          assert.equal(username, 'Test', "The user's full name is displayed after");
          assert.ok(logout.length, 'The logout button is rendered after');
          assert.ok(session.get('isAuthenticated'), 'The session is authenticated after');
      });
  });
});
