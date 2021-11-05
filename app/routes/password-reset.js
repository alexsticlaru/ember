import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from '../config/environment';

export default class PasswordResetRoute extends Route {
    @service('popup') popupService;
    @service('user') userService;
    @service phone;

    renderTemplate() {
        if (!this.userService.isAuthenticated ) {
            if (window.innerWidth <= config.breakpoints.phone) {
                this.phone.showPhonePage('login-registration.phone.password-reset-page', {}, 'login-registration.password-reset');
            } else {
                this.popupService.showPopup('login-registration.password-reset-popup', {}, undefined, 'login-registration.password-reset');
            }
        } 
    }
}