import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { isEmpty } from '@ember/utils';

export default class LoginForm extends Component {
	@service('popup') popupService;
	@service('user') userService;
	@service('debug') dbgS;
	@service toast;
	@service intl;
	@service sidePanel;
	@service router;

	@tracked errorMessage;
	@tracked identification = this.args.identification;
	@tracked password;
	@tracked showErrorMessages = false;
	@tracked showSpinner = false;

	get isDebugger(){
		console.log("debugger:" + this.dbgS.isDebugger);
		return this.dbgS.isDebugger;
	}

	get isEmailValid() {
		return !isEmpty(this.identification);
	}

	get isPasswordValid() {
		return !isEmpty(this.password);
	}

	@action
	async authenticate(e) {
		e.preventDefault();
		if (this.isEmailValid && this.isPasswordValid) {
			this.showSpinner = true;
			let { identification, password } = this;
			await this.userService.authenticate(identification, password, this._loginSucceedHandler.bind(this), this._loginFailureHandler.bind(this));
		} else {
			this.showErrorMessages = true;
		}
	}

	_loginSucceedHandler(){
		const user = this.userService.currentUser;
// 		this.$('form .login-form').reset();
		this.identification = "";
		this.password = "";
		this.popupService.close();
		let uname = user.firstName ? user.firstName : user.lastName ;
		this.toast.success(
			`${this.intl.t('bubble.login.confirm.before')} ${uname}.`,
			this.intl.t('bubble.login.confirm.title')
		);
		this.showSpinner = false;
		if (this.router.currentURL === "/") {
			this.router.transitionTo('communities');
		}

		this.sidePanel.hideSidePanel();
	}

	_loginFailureHandler(error){
		this.errorMessage = error.responseJSON.error_description;
		this.showErrorMessages = true;
		this.showSpinner = false;
	}

	@action
	onPasswordLostClick(){
		this.args.onPasswordLostClick(this.identification);
	}

	@action
	showRecoveryPassword() {
		if (this.args.isPhone) {
			this.sidePanel.showSidePanel('login-registration.phone.password-recovery-page', {}, 'login-registration.password-recovery');
		} else {
			this.popupService.showPopup('login-registration.password-recovery-popup', {}, undefined, 'login-registration.password-recovery');
		}
	}
}
