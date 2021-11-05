import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import config from '../../config/environment';
import fetch from 'fetch';

export default class RegistrationWelcomeController extends Controller {
    @service('popup') popupService;
    @service session;
    @service sidePanel;

    @action
    close() {
        this.popupService.close();
    }

    @action
    onOutsideClick() {
        this.popupService.close();
    }

    @action
    sendEmailConfirmation() {
		const token = this.session.data.authenticated.access_token
		const url = `${config.APP.API_HOST}/api/sendEmailConfirmation?access_token=${token}&v7=true` ;
		fetch(url, {method: 'POST'});
	}

    @action
    closePage() {
        this.sidePanel.hideSidePanel();
    }
}
