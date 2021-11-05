import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from 'civ/tests/helpers/start-app';

var application;
let session;

module('Acceptance | Issue', function(hooks) {
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

  test('TODO: User can add a stakeholding with a new valid email', function(assert) {
      assert.expect(1);
      assert.equal(true, true);
  //	assert.expect(7);
  //	var pageTitle = "Test",
  //		timestamp= parseInt(Date.now() / 1000),
  //		stakeholdingName = 'Test'+timestamp,
  //		stakeholdingTitle = 'stakeholder for test',
  //		stakeholdingEmail = 'test'+timestamp+'@civocracy.org',
  //		stakeholdingDescription = 'This is an influencer added from the automated tests.';
  //
  //	visit('/');
  //	andThen(function() {
  //		assert.ok(!session.get('isAuthenticated'), 'The session is not authenticated before');
  //	});
  //
  //	login(true) ; // login as admin to add a stakeholding.
  //
  //	andThen(function() {
  //		let username = find('#m-menu > h3:first > span').text().trim();
  //		assert.equal(username, 'Superduper Testuser', "The user's full name is displayed after");
  //		assert.ok(session.get('isAuthenticated'), 'The session is authenticated after');
  //	});
  //
  //	visit('/discussions/42/learn');
  //	andThen(function() {
  //		let title = find('.top-header .header-subtitle').text();
  //		assert.equal(title, pageTitle, 'User accessed the issue page.');
  //	});
  //	fillIn('.stakeholding-add-form .input-name', stakeholdingName);
  //	fillIn('.stakeholding-add-form .stakeholding-title', stakeholdingTitle);
  //	fillIn('.stakeholding-add-form .stakeholding-email', stakeholdingEmail);
  //	fillIn('.stakeholding-add-form .stakeholding-summary', stakeholdingDescription);
  //
  //	andThen(function() {
  //		var email = find('.stakeholding-add-form .stakeholding-email').val();
  //		assert.equal(email, stakeholdingEmail, 'Email is filled in');
  //	});
  //	click('.stakeholding-add-form .publish-button');
  //	andThen(function() {
  //		waitFor(assert, function() {
  //			var toastMessage= find('#toast-container .toast-success');
  //			//Make assertion
  //			assert.ok(toastMessage.length, "A confirmation message was displayed");
  //			var firstStakeholdingName = $.trim( find('.stakeholding-item:last .stakeholdings-description a').text());
  //			assert.equal(firstStakeholdingName, stakeholdingName, 'The newly added stakeholding is the last in the list');
  //		},1000);
  //	});
  });
});
