import { run } from '@ember/runloop';
import { module, test } from 'qunit' ;
import startApp from 'civ/tests/helpers/start-app' ;

var application ;
let session ;

module('Acceptance | Issue', function(hooks) {
  hooks.beforeEach(function () {
      application = startApp() ;
      // Prevent session restoring
      localStorage.removeItem('civocracy:session') ;
      // Get references to the required services
      session = application.__container__.lookup('service:session') ;
  });

  hooks.afterEach(function() {
      run(application, 'destroy') ;
  });

  test('TODO: User can add an article with a valid url', function (assert) {
      assert.expect(1);
      assert.equal(true, true);
  //	assert.expect(5) ;
  //	var     pageTitle = "Test",
  //	        timestamp = parseInt( Date.now() / 1000 ),
  //	 articleToBeAdded = 'http://www.boredpanda.com/finnish-lapland-winter-photography-finland/?timestamp=' + timestamp,
  //	     articleTitle = 'Test article ' + timestamp ;
  //
  //	// Load app and login
  //	visit('/') ;
  //	andThen( function() {
  //		assert.ok(!session.get('isAuthenticated'), 'The session is not authenticated before') ;
  //	}) ;
  //	login() ;
  //	andThen( function() {
  //		let username = find('#m-menu > h3:first > span').text().trim() ;
  //		assert.equal(username, 'Test', "The user's full name is displayed after") ;
  //		assert.ok(session.get('isAuthenticated'), 'The session is authenticated after') ;
  //	});
  //
  //	// Open Test issue
  //	visit('/discussions/42/learn') ;
  //	andThen( function() {
  //		let title = find('.top-header .header-subtitle').text() ;
  //		assert.equal(title, pageTitle, 'User accessed the issue page.') ;
  //	});
  //
  //	// Fill form
  //	fillIn('.link-add-form .input-wrapper input:first', articleToBeAdded) ;
  //	andThen( function () {
  //		waitFor(assert, function () {
  //			fillIn('.link-add-form .displayDetails input.ember-text-field', articleTitle) ;
  //		}, 100) ;
  //	}) ;
  //
  //	// Submit
  //	click('.link-add-form .publish-button') ;
  //	andThen( function () {
  //		waitFor(assert, function () {
  //			var toastMessage= find('#toast-container .toast-success') ;
  //			assert.ok(toastMessage.length, "A confirmation message was displayed") ;
  //		}, 4000) ;
  //	}) ;
  }) ;
});

