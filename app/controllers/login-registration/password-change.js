import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { isEmpty } from '@ember/utils';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PasswordChangeController extends Controller {
    @service intl;
    @service toast;
	@service('popup') popupService;
	@service('user') userService;
	@service phone;

	@tracked oldPassword;
	@tracked newPassword;
	@tracked newPasswordRepeat;
	@tracked showErrorMessages = false;


	get isOldPasswordValid() {
		return  !isEmpty(this.oldPassword);
	}

	get isNewPasswordValid() {
		return !isEmpty(this.newPassword) && this.newPassword.length > 5;
	}

	get arePasswordsMatch() {
		return this.newPassword === this.newPasswordRepeat;
	}

	@action
	submitPopup(e){
		e.preventDefault();
		if(this.isOldPasswordValid && this.isNewPasswordValid && this.arePasswordsMatch) {
				const user = this.userService.getCurrentUser();
				user.password = this.newPassword;
				user.checkPassword = this.oldPassword;
				user.save().then(() => {
					this.popupService.close();
					const message = this.intl.t('login.passwordChangeSuccess');
					this.toast.success(message);
				}).catch((e) => {
					// check for error code 403 -> wrong pw, else show unknown error message
					if (e.errors[0].status == "403") {
						const message = this.intl.t('login.passwordChangeFailure');
						this.toast.error(message);
					} else {
						const message = this.intl.t('bubble.error.unknown');
						this.toast.error(message);
					}
			});

		} else {
			this.showErrorMessages = true;
		}
	}

	@action	
	hideModal(){
		this.popupService.close();
	}

	@action
    closePage() {
        this.phone.hidePhonePage();
    }
}
