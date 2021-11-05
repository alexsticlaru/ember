import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import config from '../../config/environment';

export default class PasswordResetController extends Controller {
    @service intl;
    @service toast;
    @service session;
	@service('popup') popupService;
	@service('user') userService;
	@service sidePanel;

	queryParams = [
		'access_token',
		'userId',
		'token'
	]

	@tracked newPassword = '';
	@tracked newPasswordRepeat= '';
	@tracked showErrorMessages = false;
	@tracked showSpinner = false;

	get isNewPasswordValid() {
		return !isEmpty(this.newPassword) && this.newPassword.length > 5;
	}

	get arePasswordsMatch() {
		return this.newPassword === this.newPasswordRepeat;
	}

	createUrl() {
		let token;
		if ( this.token) {
			token = `?token=${this.token}`;
		} else {
			token = `?access_token=${this.access_token}` ;
		}

		return `${config.APP.API_HOST}/api/users/${this.userId}${token}`;
	}

	async fetchData() {
		const data = {password: this.newPassword};
		return await fetch(this.createUrl(), {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}
		);
	}

	@action
	submitPopup(e) {
		e.preventDefault();
		if(this.isNewPasswordValid && this.arePasswordsMatch) {
			this.showSpinner = true;
			this.showErrorMessages = false;
			this.fetchData().then((response) => {
				this.showSpinner = false;
				this.popupService.close();
				this.handleResponse(response);
			}).catch( () => {
				this.showSpinner = false;
				this.toast.error(this.intl.t('bubble.error.unknown'));
			})

		} else {
			this.showErrorMessages = true;
		}
	}

	handleResponse(response) {
		if(response.ok) {
			this.toast.success(
				this.intl.t('bubble.password.reset.confirm'),
				this.intl.t('bubble.password.reset.confirm.title')
			);
			response.json().then((rsp) => {
				this.authenticatedUser(rsp);
			})
		} else {
			this.toast.error(
				this.intl.t('bubble.error.unknown')
			);
		}
	}

	authenticatedUser(rsp) {
		this.session.authenticate('authenticator:oauth2-implicit-grant', rsp.data);
		this.userService.loadCurrentUserById(this.userId);
		localStorage.setItem('userId', this.userId);
	}

	@action
	hideModal(){
		this.popupService.close();
	}

	@action
    closePage() {
        this.sidePanel.hideSidePanel();
    }
}
