import {inject as service} from '@ember/service';
import Route from '@ember/routing/route';
import config from 'civ/config/environment' ;

/**
 * This is the route for the
 * EMAIL CONFIRMATION.
 *
 * @class ConfirmEmailRoute
 * @extends Route
 */
export default class ConfirmEmailRoute extends Route {
	@service intl;
	@service toast

	queryParams = {
		token: {},
		userId: {}
	}

	async model(params) {
		const userId = params.userId;
		const token = params.token;

		// redirect to home, and then do the backend call
		// using 'finally' so it's going to run even if home is redirected to something else
		this.transitionTo('home').promise.finally(() => {
			// notify the backend, will send the welcome email if ok
			const url = `${config.APP.API_HOST}/api/confirmEmail?userId=${userId}&token=${token}&v7=1`;
			try {
				fetch(url).then((response) => {
					if (response.ok) {
						this.toast.success(this.intl.t('confirmEmail.message'));
					} else {
						this.toast.error(this.intl.t('bubble.error.unknown'));
					}
				});
			} catch (e) {
				this.toast.error(this.intl.t('bubble.error.unknown'));
			}
		});
	}
}
