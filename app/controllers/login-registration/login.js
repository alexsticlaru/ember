import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import config from '../../config/environment';


export default class LoginPopupController extends Controller {
	@service intl;
	@service session;
	@service toast;
	@service phone;
	@service sidePanel;
	@service('popup') popupService;
	@service router;
	@service loginRender;
	@tracked showAuthChooser = true;
	@tracked showPasswordLost = false;
	@tracked isLoginForm = false;
	@tracked isCompletingFbAuth = false;
	@tracked _loginEmail = "";//repository to pass the login.identification to the passwordLost.email to avoid for the user to type again his login

	constructor() {
		super(...arguments);
	}

	get passwordLost() {
		return this.popupService.passwordLost;
	}

	get modalTitle() {
		if( this.isCompletingFbAuth) {
			return 'Facebook';
		} else {
			return this.intl.t('login.title');
		}
	}

	@action
	focusOnPopup(element) {
		element.focus();
	}

	@action
	hideModal() {
		this.popupService.close();
		this.showAuthChooser = true;
		this.isCompletingFbAuth = false;
		this.showPasswordLost = false;
	}

	@action
	showLoginForm(passLostEmail) {
		if(passLostEmail)
			this._loginEmail = passLostEmail;
		this.showPasswordLost = false;
		this.showAuthChooser = false;
		this.isLoginForm = true;
		//this.loginRender.renderDeviceSpecificLogin();
	}

	@action
	showPasswordLostForm(loginEmail){//aka onPasswordLostClick
		this._loginEmail = loginEmail;
		this.showPasswordLost = true;
	}

	@action
	async loginWithFacebook() {
		try {
			this.isCompletingFbAuth = true;
			await this.session.authenticate('authenticator:torii', 'facebook-oauth2');
		} catch(error) {
			this.toast.error(this.intl.t('bubble.error.unknown'));
		} finally {
			this.isCompletingFbAuth = false;
		}
	}

	@action
	showRegistrationForm() {
		if (window.innerWidth <= config.breakpoints.phone) {
			this.showAuthChooser = true;
			this.sidePanel.showSidePanel('login-registration.phone.registration-page', {}, 'login-registration.registration');
		} else {
			this.popupService.showPopup('login-registration.registration-popup', {}, undefined, 'login-registration.registration');
		}
	}

    @action
    closePage() {
        // this.phone.hidePhonePage();
        this.sidePanel.hideSidePanel();
    }
}
