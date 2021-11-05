import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
//import config from 'config/environment';
import fetch from 'fetch';
import { tracked } from '@glimmer/tracking';
import { isEmpty } from '@ember/utils';


export default class MailActivationController extends Controller {
    @service('popup') popupService;
    @service session;
    @service intl;
    @service toast;
    @service phone;
    @service('user') userService;
    @tracked isEmailSent = false;
    @tracked isEmailUpdated = false;
    @tracked isChangeEmailForm = false;
    @tracked showErrorMessages = false;
    @tracked email;
    @tracked password;
    @tracked showForbiddenMessage = false;
    emailRegex = /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;

    get isEmailValid() {
        return !isEmpty(this.email) && this.emailRegex.test(this.email);
    }

    get isPasswordValid() {
        return this.userService.isOlderUser ? !isEmpty(this.password) && !this.showForbiddenMessage : true;
    }

    @action
    close() {
        this.isEmailSent = false;
        this.isEmailUpdated = false;
        this.isChangeEmailForm = false;
        this.showErrorMessages = false;
        this.showForbiddenMessage = false;
        this.popupService.close();
    }

    @action
    closePage() {
        this.isEmailSent = false;
        this.isEmailUpdated = false;
        this.isChangeEmailForm = false;
        this.showErrorMessages = false;
        this.showForbiddenMessage = false;
        this.phone.hidePhonePage();
    }

    @action
    showChangeEmailForm() {
        this.isChangeEmailForm = true;
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

    @action
    async changeEmail(e) {
        e.preventDefault();
        this.showErrorMessages = false;
        this.showForbiddenMessage = false;
        if(this.isEmailValid && this.isPasswordValid) {
            const user = this.userService.getCurrentUser()
            user.email = this.email;
            user.checkPassword = this.userService.isOlderUser ? this.password : undefined;
            try {
                await user.save();
                this.isChangeEmailForm = false;
                this.isEmailSent = false;
                this.isEmailUpdated = true;
            }
            catch(error) {
                if (error.errors.firstObject.status === "403") {
                    this.showErrorMessages = true;
                    this.showForbiddenMessage = true;
                } else {
                    this.toast.error(this.intl.t('bubble.error.unknown'));
                }
            }
        } else {
            this.showErrorMessages = true;
        }

    }
    @action
	hideModal() {
		this.popupService.close();
		this.showAuthChooser = true;
		this.isCompletingFbAuth = false;
	}

    @action closePopup() {
		this.popup.close();
	}
   
}
