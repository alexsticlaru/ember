import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from '../config/environment';

export default class ActivationPopupRoute extends Route {
    @service('popup') popupService;
    @service('user') userService;
    @service phone;

    renderTemplate() {
        if (this.userService.isAuthenticated ) {
            this.renderActivationEmail();
        } 
    }

    renderActivationEmail() {
        if (window.innerWidth <= config.breakpoints.phone) {
            this.phone.showPhonePage('login-registration.phone.activation-mail-page', {}, 'login-registration.activation-mail');
        } else {
            this.popupService.showPopup('login-registration.activation-mail-popup', {}, undefined, 'login-registration.activation-mail');
        }
    }
}