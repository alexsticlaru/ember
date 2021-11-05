import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RegistrationController extends Controller {
	@service intl;
	@service('popup') popupService;
	@service session;
	@service toast;
	@service sidePanel;
	@service router;
	@service loginRender;

	@tracked showRegisterChooser = true;
	@tracked isRegisterForm = false
	@tracked isCompletingFbAuth = false;

	get modalTitle() {
		if(this.isCompletingFbAuth) {
			return 'Facebook';
		} else {
			return this.intl.t('register.title');
		}
	}

	@action
	focusOnPopup(element) {
		element.focus();
	}

	@action
	hideModal() {
		this.popupService.close();
		this.showRegisterChooser = true;
		this.isCompletingFbAuth = false;
	}

	@action
	showLogin() {
		this.showRegisterChooser = true;
		this.loginRender.renderDeviceSpecificLogin();
	}

	@action
	showRegisterForm() {
		this.showRegisterChooser = false;
		this.isRegisterForm = true;
	}

	@action
	async registerWithFacebook() {
		this.isCompletingFbAuth = true;
		try {
			await this.session.authenticate('authenticator:torii', 'facebook-oauth2');
		} catch(error) {
			this.toast.error(this.intl.t('bubble.error.unknown'));
		} finally {
			this.isCompletingFbAuth = false;
		}
	}

	@action
    closePage() {
        this.sidePanel.hideSidePanel();
    }

}
