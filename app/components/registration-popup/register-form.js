import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class RegisterForm extends Component {
    @service intl;
    @service store;
    @service('user') userService;
    @service('popup') popupService;
    @service session;
    @service sidePanel;

	@tracked showSpinner = false;
    @tracked firstName;
    @tracked lastName;
    @tracked email;
    @tracked password;
    @tracked isCaptchaValid = false;
    @tracked showErrorMessages = false;
    @tracked showAlreadyExistMessage = false;
    @tracked authErrorMessage;
    @tracked isAgreementAccepted = false;
    emailRegex = /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/i;//we don't bother about the case, we'll lower it in the db

    get isFirstNameValid() {
        return !isEmpty(this.firstName);
    }

    get isLastNameValid() {
        return !isEmpty(this.lastName);
    }

    get isEmailValid() {
        return !isEmpty(this.email) && this.emailRegex.test(this.email);
    }

    get isPasswordValid() {
        return !isEmpty(this.password) && this.password.length > 5;
    }

    get areAllFiledsSet() {
        return this.isFirstNameValid&&this.isLastNameValid&&this.isEmailValid&&this.isPasswordValid;
    }

    onCaptchaSuccess() {
        this.isCaptchaValid = true;
    }

    onCaptchaExpire() {
        this.isCaptchaValid = false;
    }

    @action
    renderCaptcha() {
        window.grecaptcha.render(document.querySelector('#captcha-container'), {
            //'sitekey' : '6LcNjZ4UAAAAAObfbsKJeST27iaVVXono0bRuH2w', //not working on other domains than civocracy.org
            'sitekey' : '6LcuXq4UAAAAAJ6rUzVjf7L5-nM0jqvXQ6ZrCkhM', //created on account webmaster@jokaweb.net as work-around for separated domains authentication
            //'size': 'normal', (border is cut and we cant change the iframe size to correct that then we change the format)
            //'size': 'compact',
            'hl': this.intl.locale,
            'callback': () => this.onCaptchaSuccess(),
            'transform': 'scale(0.8); transform-origin:0 0',
            'expired-callback': () => this.onCaptchaExpire()

        });
    }


    async checkIfUserExists() {
		const user = await this.store.queryRecord('user', {
			"filters[email]": this.email
        });

		return !isEmpty(user);
    }

    setupAfterUserCreation(user) {
        this.session.authenticate('authenticator:oauth2', user.email, user.password)
        .catch((error) => {
            this.authErrorMessage = error.responseJSON.error_description;
        });

        localStorage.setItem('userId', user.id);
        if (this.args.isPhone) {
            this.sidePanel.showSidePanel('login-registration.phone.registration-welcome-page', {}, 'login-registration.registration-welcome');
        } else {
            this.popupService.showPopup('login-registration.registration-welcome-popup', {}, undefined, 'login-registration.registration-welcome');
        }
    }

    @action
    async registerUser(e) {
        e.preventDefault();
        if (this.areAllFiledsSet && this.isCaptchaValid && this.isAgreementAccepted) {
			this.showSpinner = true;
            this.showErrorMessages = false;
            const alreadyExist = await this.checkIfUserExists();
            if(!alreadyExist) {
                this.showAlreadyExistMessage = false;
                const user = await this.userService.createNewUser({
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    password: this.password,
                    username: this.firstName + this.lastName,
                    locale: this.intl.locale,
					v7: true
                }).catch( error => {
console.error("registration error !" ,error);
				});
				this.showSpinner = false;
                this.setupAfterUserCreation(user);
				this.firstName = "";
				this.lastName = "";
				this.email = "";
				this.password = "";
            } else {
                this.showAlreadyExistMessage = true;
            }
        } else {
            this.showErrorMessages = true;
        }
    }


}
