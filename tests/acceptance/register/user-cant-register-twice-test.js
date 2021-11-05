import { run } from '@ember/runloop';
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'civ/tests/helpers/start-app';

var application;
let session;

module('Acceptance | Register', function(hooks) {
  hooks.beforeEach(function() {
      application = startApp();
      // Prevent session restoring
      localStorage.removeItem('civocracy:session');
      // Get references to the required services
      session = application.__container__.lookup('service:session');

      Ember.Test.adapter.exception = function() {};
  });

  hooks.afterEach(function() {
      run(application, 'destroy');
  });

  test('User cant register twice', function(assert) {
      assert.expect(5);

      visit('/');
      andThen(function() {
          let logoutBtn = find('#m-menu a#btn-logout');
          assert.ok(!logoutBtn.length, 'The logout button is not rendered before');
          assert.ok(!session.get('isAuthenticated'), 'The session is not authenticated before');
      });

      click('.btn-register') ;
      fillIn('#login-popup input.first-name', 'test') ;
      fillIn('#login-popup input.last-name', 'test') ;
      fillIn('#login-popup input.email', 'test@civocracy.org') ;
      fillIn('#login-popup input.password', 'test123') ;
     fillIn('#login-popup input.autocomplete-input', 'Iasi') ;
     click('#login-popup .autocomplete-list a.autocomplete-search-item.selected-true > li') ;
      andThen(function() {
          click('#login-popup > div.modal-body > #register-step-auth > button[type="submit"]') ;

          andThen(function() {
              waitFor(assert, function(){
                  var toastMessage= find('#toast-container .toast-error');
                  //Make assertion
                  assert.ok(toastMessage.length, "An error message was displayed") ;

                  let logoutBtn = find('.menu-holder #btn-logout');
                  assert.ok(!logoutBtn.length, 'The logout button is not rendered after');
                  assert.ok(!session.get('isAuthenticated'), 'The session is not authenticated after invalid login');

                  //close login popup
                  click('#login-popup > div.modal-header > button');
              }, 1000);
          });
      });

  });
});
