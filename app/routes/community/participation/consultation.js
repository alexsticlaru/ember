import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class ParticipationConsultationRoute extends Route {

	@service analytics;
	@service meta;
	@service('popup') popupService;
	@service('user') userService;
	@service loginRender;

	beforeModel(transition) {
		/*
		if(!this.userService.isAuthenticated) {
			transition.abort();
			this.transitionTo('community', transition.resolvedModels.community.community.url).then(() =>
				this.loginRender.renderDeviceSpecificLogin()
			);
		}
		 */
	}

	async model(params) {
		const participationPack = await this.store.findRecord('participation-pack', params.consultation_id)
			.catch(() => {
				this.transitionTo('community.participation');
			});

		if (participationPack.url != params.consultation_url) {
			this.transitionTo('community.participation');
		}

		return RSVP.hash({
			issue: participationPack.issue,	// side-loaded in first request
			participationPack: participationPack,
			project: this.modelFor('community.participation').project,
			community: this.modelFor('community').community,
		});
	}


	afterModel() {
		this.analytics.trackPiwikPageView(window.location.href);
		this.meta.addMetaTags({title: 'Community Consultation'});
	}
}
