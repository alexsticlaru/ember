import EmberRouter from '@ember/routing/router';
import config from 'civ/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map( function () {
  this.route('home', {path: '/'}, function () {
      this.route('activation-mail', {path: 'activationMail', resetNamespace: true});
      this.route('login', {resetNamespace: true});
      this.route('password-recovery', {path: 'newPassword', resetNamespace: true});
      this.route('password-reset', {path: 'resetPassword', resetNamespace: true});
      this.route('register', {resetNamespace: true});
  });

  this.route('confirm-email', {path: 'confirmEmail'});
  this.route('code-of-conduct');
  this.route('data-privacy');
  this.route('terms-and-conditions');
  this.route('not-found', {path: '/*path'});

  this.route('community', {path: '/:community_url'}, function() {
    this.route('settings', function() {
      this.route('administrator');
    });
    this.route('add-project');
    this.route('activation-mail-popup');
    this.route('access-project', {path: '/:project_url/access'});
    this.route('participation', {path: '/:participation_url'}, function() {
      this.route('updates');
      this.route('events');
      this.route('documents');
      this.route('proposition', {path: '/proposition/:proposition_id/:proposition_url'}, function() {
        this.route('idea', {path: '/:idea_id'});
        this.route('index', { path: '/' });
      });
      this.route('consultation', {path: '/consultation/:consultation_id/:consultation_url'}, function() {
        this.route('act', function() {
          this.route('contribution', {path: '/:contribution_id'});
          this.route('outcome',{ path: '/outcome/:outcome_id' });
          this.route('index', { path: '/' });
        });
      });
      this.route('custom', {path: '/:custom_id/:custom_url'});
      this.route('map', {path: '/map/:custom_id/:custom_url'});
      this.route('questionnaire', {path: '/questionnaire/:questionnaire_id/:questionnaire_url'}, function() {
        this.route('questionnaire-results', {path: '/results'})
      })
      this.route('settings', function() {
        this.route('index', { path: '/' });
        this.route('updates', function() {
          this.route('update', {path: '/:update_id'});
        });
        this.route('add-modules');
        this.route('modules', {path: '/modules/:module_id'}, function() {
          });
        this.route('administrator');
        this.route('documents', function() {
          this.route('document', {path: '/:document_id'});
        });
      });
    });
  });


  this.route('user', {path: '/user/:user_id/'});
  this.route('communities');
  this.route('projects');
  this.route('settings', function() {
    this.route('profile');
    this.route('saved');
  });
  this.route('how-it-works');
});
