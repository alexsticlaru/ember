import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import config from '../config/environment';

export default class RegisterRoute extends Route {

	@service session
	@service('popup') popupService;
	@service phone;

	renderTemplate() {
		if ( !this.session.isAuthenticated ) {
			if (window.innerWidth <= config.breakpoints.phone) {
				this.phone.showPhonePage('login-registration.phone.registration-page', {}, 'login-registration.registration');
			} else {
				this.popupService.showPopup('login-registration.registration-popup', {}, undefined, 'login-registration.registration');
			}
		}
	}

}

