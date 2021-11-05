import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from '../config/environment';


export default class PasswordRecovery extends Route {
    @service('popup') popupService;
    @service('user') userService;
    @service phone;

    renderTemplate() {
        if ( this.userService.isAuthenticated ) {
            this.renderPasswordChange();
        } else {
            this.renderPasswordRecovery();
        }
    }

    renderPasswordChange() {
        if (window.innerWidth <= config.breakpoints.phone) {
            this.phone.showPhonePage('login-registration.phone.password-change-page', {}, 'login-registration.password-change');
        } else {
            this.popupService.showPopup('login-registration.password-change-popup', {}, undefined, 'login-registration.password-change');
        }
    }

    renderPasswordRecovery() {
        if (window.innerWidth <= config.breakpoints.phone) {
            this.phone.showPhonePage('login-registration.phone.password-recovery-page', {}, 'login-registration.password-recovery');
        } else {
            this.popupService.showPopup('login-registration.password-recovery-popup', {}, undefined, 'login-registration.password-recovery');
        }
    }

    
}
