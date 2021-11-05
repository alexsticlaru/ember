import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'civ/config/environment';

export default class UserController extends Controller {
	@service intl;
	@service popup;
	@service user;

	@tracked showAboutSection = true;
	@tracked showPropositionsSection = false;

	get canEdit() {
		if (this.user.getCurrentUser() == this.model) {
			return true;
		}
		return false;
	}

	@action	showAbout() {
		this.showAboutSection = true;
		this.showPropositionsSection = false;
	}

	@action	showPropositions() {
		this.showAboutSection = false;
		this.showPropositionsSection = true;
	}

	@action	showOnMap(proposition) {
		this.popup.showPopup("map-popup", proposition);
	}

	@action
    async sendEmailConfirmation() {
        this.isEmailSent = true;
		const token = this.session.data.authenticated.access_token
        const url = `${config.APP.API_HOST}/api/sendEmailConfirmation?access_token=${token}&v7=true`;
        try {
            fetch(url, {method: 'POST'});
        }
        catch(error) {
            this.toast.error(this.intl.t('bubble.error.unknown'));
        }
    }

	showActivationEmailPopup() {
        if (window.innerWidth <= config.breakpoints.phone) {
            this.phone.showPhonePage('login-registration.phone.activation-mail-page', {}, 'login-registration.activation-mail');
        } else {
            this.popupService.showPopup('login-registration.activation-mail-popup', {}, undefined, 'login-registration.activation-mail');
        }
    }
	
}
