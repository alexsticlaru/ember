import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class UserMenuController extends Controller {
    @service phone;
    @service sidePanel;
    @service intl;
    @service community;
    @service('user') userService;

    @tracked userCommunities = [];
    @tracked userProjects = [];

    constructor() {
      super(...arguments);
      this.community.getUserCommunities().then((communities) =>
      this.userCommunities = communities
    );

    this.community.getUserProjects().then((projects) => {
      this.userProjects = projects;
    });
  }


/*moved in intl !
    languages = A([
        {name: 'English', iso1: 'en', iso2:'Eng'},
        {name: 'Español', iso1:'es', iso2: 'Spa'},
        {name: 'Deutsche', iso1:'de', iso2: 'Ger'},
        {name: 'Français', iso1: 'fr', iso2:'Fre'},
        {name: 'Hrvatski', iso1:'hr', iso2: 'hrv'},
        {name: 'Nederlands', iso1:'nl', iso2: 'Nld'}
	]);

	@tracked currentLanguage = this.languages.find((item) => item.iso1 === this.intl.primaryLocale);
*/
    @tracked showLanguages = false;

    @action
    changeLanguage(language) {
        //DEPRECATED this.currentLanguage = language;
        this.intl.setLocale([language.iso1]);
        this.showLanguages = false;
	}

    @action
    toggleLanguages() {
        this.showLanguages = !this.showLanguages;
    }

    @action
    closePage() {
        this.phone.hidePhonePage();
    }

    @action
    showRegistration() {
        this.sidePanel.showSidePanel('login-registration.phone.registration-page', {}, 'login-registration.registration');
    }

    @action
	showLogin() {
		this.sidePanel.showSidePanel('login-registration.phone.login-page', {},'login-registration.login');
	}

    @action
    logout() {
        this.userService.logout();
    }
}
