import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class UserMenu extends Component {
	@service intl;
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
	activateTranslatorTool(){
		this.intl.activateTranslatorTool();
	}

	@action
	showTranslationsChanges(){
		this.intl.popupTranslationsSummary();
	}
}
