import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from 'civ/tests/helpers/start-app';

var application;
let session;

module('Acceptance | Issue act', function(hooks) {
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

  test('TODO: User can add a comment', function (assert) {
      assert.expect(1);
      assert.equal(true, true);
  //	assert.expect(4);
  //	var   pageTitle = "Test",
  //		   timestamp = parseInt(Date.now() / 1000),
  //	   commentTitle = "TestComment " + timestamp,
  //	 commentMessage = "This is a comment added from the acceptance tests." ;
  //
  //	visit('/') ;
  //	login() ;
  //	visit('/discussions/42/act') ;
  //
  //	andThen( function () {
  //		let title = find('.top-header .header-subtitle').text();
  //		assert.equal(title, pageTitle, 'User accessed the issue page.');
  //	});
  //
  //	fillIn('.comment-add-form:first .ember-text-field', commentTitle);
  //	click('.comment-add-form:first .content-add-description');
  //	andThen( function () {
  //		$('.comment-add-form:first .content-add-description [contenteditable="true"]').html(commentMessage);
  //		triggerEvent('.comment-add-form:first .content-add-description [contenteditable="true"]', 'keyup');
  //	});
  //	click('.comment-add-form:first .ember-text-field');
  //	andThen( function () {
  //		var title = find('.comment-add-form:first .ember-text-field').val();
  //		assert.equal(title, commentTitle, 'Comment title is filled in');
  //	}) ;
  //	click('.comment-add-form:first .publish-button');
  //	andThen( function () {
  //		waitFor(assert, function () {
  //			//var toastMessage= find('#toast-container .toast-success');
  //			//Make assertion
  //			//assert.ok(toastMessage.length, "A confirmation message was displayed");
  //			var firstCommentTitle = $.trim( find('.comment-item:first .title').text());
  //			assert.equal(firstCommentTitle, commentTitle, 'The newly added comment is the first in the list');
  //			var content = find('.comment-item:first .comment-content').text().trim();
  //			assert.equal(content, commentMessage, 'Comment description is the right one');
  //		}, 4000);
  //	});
  });
});

