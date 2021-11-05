import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import config from '../../config/environment';
import fetch from 'fetch';
import { tracked } from '@glimmer/tracking';
import { isEmpty } from '@ember/utils';
import TopHeaderComponent from '../../components/top-header';
import Component from '@glimmer/component';


export default class ActivationMailBannerComponent extends Component {

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
}
