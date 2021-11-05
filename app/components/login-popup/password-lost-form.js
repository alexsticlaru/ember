import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { isEmpty } from '@ember/utils';
import config from '../../config/environment' ;


export default class LoginForm extends Component {
	@service('popup') popupService;
	@service('user') userService;
	@service('debug') dbgS;
	@service toast;
	@service intl;
	@service sidePanel;
	@service router;

	@tracked email = this.args.loginEmail;
	@tracked errorMessage;
	@tracked showErrorMessages = false;
	@tracked showEmailRequiredMessage = false;
	@tracked showSpinner = false;

	@action
	onGotoLoginClick(){
		this.args.onGotoLoginClick(this.email);
	}

    @action
    validateEmail() {
        this.showEmailRequiredMessage = isEmpty(this.email);
		this.errorMessage = this.intl.t('login.emailRequired');
		return !this.showEmailRequiredMessage;
    }

    /**
    * Sends the password request.
    * The back-end will then send an email to the user,
    * containing a link to reset his password.
    * @method submitPopup
    */
    @action
	resetPassword(e) {
        e.preventDefault();
        if ( this.validateEmail() ) {
            this.showSpinner = true;
            fetch(`${config.APP.API_HOST}/api/passwordrequest?email=${this.email}`
                ).then((rsp) => {
                    this.showSpinner = false;
                    this.handleResponse(rsp);
                }).catch( () => {
                    this.showSpinner = false;
                    this.toast.error(this.intl.t('bubble.error.account.passwordLostEmailNotFound'));
					this.showEmailRequiredMessage = true;
					this.errorMessage = this.intl.t('login.errors.passwordLostEmailNotFound');
                })
        } else {
             this.showEmailRequiredMessage = true;
        }
    }

    handleResponse(rsp) {
        if(rsp.ok) {
            this.toast.success(
                this.intl.t('bubble.password.recovery.confirm'),
                this.intl.t('bubble.password.recovery.confirm.title')
            );
        } else if(isNotFoundResponse(rsp)){
            this.toast.info(
                this.intl.t('bubble.error.unknownUser')
            );
        } else {
            this.toast.error(
                this.intl.t('bubble.error.unknown')
            );
        }
    }
}
