import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HeaderRight extends Component {
	@service intl;
	@service toast;
	@service('popup') popupService;
	@service('user') userService;

	@tracked currentLanguage = this.intl.currentLanguage;

	get userIsTranslator(){
		return this.userService.isTranslator;
	}

	get loggedUser() {
		return this.userService.getCurrentUser();
	}

	@action
    changeLanguage(language, dropdown, e) {
//         this.currentLanguage = language;
        this.intl.setLocale([language.iso1]);
        dropdown.actions.close(e);
	}

	@action
	showLogin() {
		this.popupService.showPopup('login-registration.login-popup', {}, undefined, 'login-registration.login');
	}

	@action
	showRegistration() {
		this.popupService.showPopup('login-registration.registration-popup', {}, undefined, 'login-registration.registration');
	}

	@action
	logout() {
		this.userService.logout();
		this.toast.info(
			this.intl.t('bubble.logout.confirm'),
			this.intl.t('bubble.logout.confirm.title')
		);
	}

	@action
	activateTranslatorTool(){
		this.intl.toggleTranslatorTool();
	}

	@action
	showTranslationsChanges(){
		this.intl.popupTranslationsSummary();
	}
}
