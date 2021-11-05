import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { action } from '@ember/object';

export default class FooterPhone extends Component {
	@service intl;
	@service('user') userService;
	@service('popup') popupService;

	get emberChimpResponses() {
		return {
			success: this.intl.t('footer.register.success'),
			error: this.intl.t('footer.register.error'),
			invalidError: this.intl.t('footer.register.invalidError'),
			attemptsError: this.intl.t('footer.register.attemptsError')
		}
	}
	@action manageYourCookies(){
		this.popupService.forceCookieConsentOpening();
	}
}
