import { run } from '@ember/runloop';
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'civ/tests/helpers/start-app';

var application, originalLoggerError, originalTestAdapterException ;
let session ;

module('Acceptance | Login', function(hooks) {
  hooks.beforeEach(function() {
      application = startApp();
      // Prevent session restoring
      localStorage.removeItem('civocracy:session');
      // Get references to the required services
      session = application.__container__.lookup('service:session');

      // Trick that allows the test to pass when an error is thrown
      // source: https://github.com/emberjs/ember.js/issues/11469
      originalLoggerError = Ember.Logger.error ;
      originalTestAdapterException = Ember.Test.adapter.exception ;
      Ember.Logger.error = function() {} ;
      Ember.Test.adapter.exception = function() {} ;
  });

  hooks.afterEach(function() {
      Ember.Logger.error = originalLoggerError ;
      Ember.Test.adapter.exception = originalTestAdapterException ;
      run(application, 'destroy') ;
  });

  test('User cant login with invalid credentials', function(assert) {
      assert.expect(4);

      visit('/');
      andThen(function() {
          let logoutBtn = find('#m-menu a#btn-logout');
          assert.ok(!logoutBtn.length, 'The logout button is not rendered before');
          assert.ok(!session.get('isAuthenticated'), 'The session is not authenticated before');
      });

      //Ember.run(() => {
      //	login()
      //		.catch((err) => {
      //			assert.equal(err.body, 'Invalid username or password');
      //		});
      //});

      click('.btn-login') ;
      fillIn('input.email', 'test@civocracy.org') ;
      fillIn('input.password', 'test123') ;
      click('#login-popup > div.modal-body > #register-step-auth > button[type="submit"]') ;

      //expect(function() {
      //	click('#login-popup > div.modal-body > button[type="submit"]') ;
      //}).to.throw();
      //throws(function() {click('#login-popup > div.modal-body > button[type="submit"]');}, Error, "has thrown an Error");
      //assert.throws(() => {
      //	click('#login-popup > div.modal-body > button[type="submit"]') ;
      //},Error, 'Expect an error with this message');
      //click('#login-popup > div.modal-body > button[type="submit"]').then(function() {
      //	assert.ok(false, "promise should not be fulfilled");
      //})['catch'](function(err) {
      //	assert.equal(err.message, "User not Authorized");
      //});

      andThen(function() {
          let logoutBtn = find('#m-menu a#btn-logout');
          assert.ok(!logoutBtn.length, 'The logout button is not rendered after');
          assert.ok(!session.get('isAuthenticated'), 'The session is not authenticated after invalid login');

          //close login popup
          click('#login-popup > div.modal-header > button');
      });
  });
});
