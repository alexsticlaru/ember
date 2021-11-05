import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { isEmpty } from '@ember/utils';

export default class EmailChangeController extends Controller {
  //To Do:
  // do we need to send activation email again?

    @service('popup') popupService;
    @service intl;
    @service toast;
    @service phone;
    @service('user') userService;
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
        this.showErrorMessages = false;
        this.showForbiddenMessage = false;
        this.popupService.close();
    }

    @action
    closePage() {
        this.showErrorMessages = false;
        this.showForbiddenMessage = false;
        this.phone.hidePhonePage();
    }

    @action
    async changeEmail(e) {
        e.preventDefault();
        this.showErrorMessages = false;
        this.showForbiddenMessage = false;
        if(this.isEmailValid) {
            const user = this.userService.getCurrentUser()
            user.email = this.email;
            user.checkPassword = this.userService.isOlderUser ? this.password : undefined;
            try {
                await user.save();
                this.toast.success(this.intl.t('email-change-popup.success'));
                this.close();

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
}
