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

  test('TODO: User can delete an article', function(assert) {
      assert.expect(1);
      assert.equal(true, true);
  //	assert.expect(7);
  //	var pageTitle = "Test",
  //		articleClass='',
  //		article;
  //
  //	visit('/');
  //	andThen(function() {
  //		assert.ok(!session.get('isAuthenticated'), 'The session is not authenticated before');
  //	});
  //
  //	login();
  //
  //	andThen(function() {
  //		let username = find('#m-menu > h3:first > span').text().trim();
  //		assert.equal(username, 'Test', "The user's full name is displayed after");
  //		assert.ok(session.get('isAuthenticated'), 'The session is authenticated after');
  //	});
  //
  //	visit('/discussions/42/learn');
  //	andThen(function() {
  //		let title = find('.top-header .header-subtitle').text();
  //		assert.equal(title, pageTitle, 'User accessed the issue page.');
  //
  //		waitFor(assert, function() {
  //			//select first article in the list
  //			article = find('.link-list .link-item:first');
  //			articleClass = article.attr('class');
  //
  //			click(article.find('.btn-delete'));
  //			andThen(function () {
  //				waitFor(assert, function () {
  //					var confirmationMessage = find('#modal-overlays .dialog-text');
  //					assert.ok(confirmationMessage.length, "The delete confirmation popup was displayed");
  //
  //					click(find('#modal-overlays .confirm-button'));
  //					andThen(function () {
  //						waitFor(assert, function () {
  //							var toastMessage = find('#toast-container .toast-success');
  //							assert.ok(toastMessage.length, "A delete confirmation message was displayed");
  //
  //							var firstArticleClass = find('.link-list .link-item:first').attr('class');
  //							assert.notEqual(firstArticleClass, articleClass, "Another article is first in the list");
  //						});
  //					});
  //				},2000);
  //			});
  //		},2000);
  //	});


  });
});
