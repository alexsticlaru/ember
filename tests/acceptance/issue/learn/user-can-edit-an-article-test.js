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

  test('TODO: User can edit an article', function(assert) {
      assert.expect(1);
      assert.equal(true, true);
  //	assert.expect(7);
  //	var pageTitle = "Test",
  //		articleTitle, articleSummary,
  //		newArticleTitle, newArticleSummary;
  //
  //	// Open issue 42
  //	visit('/discussions/42/learn') ;
  //	andThen( function () {
  //		let title = find('.top-header .header-subtitle').text() ;
  //		assert.equal(title, pageTitle, 'User accessed the issue page.') ;
  //	}) ;
  //
  //	// Login
  //	login() ;
  //
  //	andThen( function () {
  //		let username = find('#m-menu > h3:first > span').text().trim() ;
  //		assert.equal(username, 'Test', "The user's full name is displayed after") ;
  //		assert.ok(session.get('isAuthenticated'), 'The session is authenticated after login') ;
  //
  //		waitFor(assert, function () {
  //			articleTitle = find('.link-list .link-item:first .title').text() ;
  //			articleSummary = find('.link-list .link-item:first .link-summary:first').text() ;
  //
  //			// Enter edit-mode
  //			click('.link-list .link-item:first .btn-edit') ;
  //
  //			andThen( function () {
  //				waitFor(assert, function () {
  //					newArticleTitle = "New title: " + articleTitle ;
  //					newArticleSummary = "New summary: " + articleSummary ;
  //					newArticleSummary = newArticleSummary.substring(0,150).trimRight() ;
  //
  //					// Edit content
  //					fillIn('.link-list .link-item:first textarea.title', newArticleTitle ) ;
  //					andThen( function () {
  //						let articleTitleChanged = find('.link-list .link-item:first textarea.title').val() ;
  //						assert.equal(newArticleTitle, articleTitleChanged, "The new article title was filled in") ;
  //					}) ;
  //					fillIn('.link-list .link-item:first textarea.link-summary', '' ) ;
  //					fillIn('.link-list .link-item:first textarea.link-summary', newArticleSummary ) ;
  //					andThen( function () {
  //						let articleSummaryChanged = find('.link-list .link-item:first textarea.link-summary').val() ;
  //						assert.equal(newArticleSummary, articleSummaryChanged, "The new article summary was filled in") ;
  //					}) ;
  //
  //					// Save
  //					click('.link-list .link-item:first .btn-save') ;
  //					andThen( function () {
  //						let articleTitleChanged = find('.link-list .link-item:first .title').text() ;
  //						assert.equal(newArticleTitle, articleTitleChanged, "The article title was changed") ;
  //						let articleSummaryChanged = find('.link-list .link-item:first .link-summary:first').text() ;
  //						assert.equal(newArticleSummary, articleSummaryChanged, "The article summary was changed") ;
  //					}) ;
  //				}, 5000) ;
  //			}) ;
  //		}, 5000) ;
  //	}) ;
  }) ;
});

