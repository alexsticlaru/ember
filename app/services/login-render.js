import Service, { inject as service }  from '@ember/service';
import config from '../config/environment';

export default class LoginRenderService extends Service {
    @service('popup') popupService;
	@service phone;
	@service sidePanel;

    renderDeviceSpecificLogin() {
		if (window.innerWidth <= config.breakpoints.phone) {
			// this.phone.showPhonePage('login-registration.phone.login-page', {}, 'login-registration.login');
			this.sidePanel.showSidePanel('login-registration.phone.login-page', {}, 'login-registration.login');
		} else {
			this.popupService.showPopup('login-registration.login-popup', {}, undefined, 'login-registration.login');
		}
	}

	renderActivationEmailPopup() {
        if (window.innerWidth <= config.breakpoints.phone) {
            this.phone.showPhonePage('login-registration.phone.activation-mail-page', {}, 'login-registration.activation-mail');
        } else {
            this.popupService.showPopup('login-registration.activation-mail-popup', {}, undefined, 'login-registration.activation-mail');
        }
    }
}
