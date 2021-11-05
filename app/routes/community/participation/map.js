import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ParticipationCustomRoute extends Route {

	@service analytics;
	@service meta;

	async model(params) {

		const participationPack = await this.store.findRecord('participation-pack', params.custom_id).catch(() => {
			this.transitionTo('community.participation');
		});

		if (participationPack.get("url") != params.custom_url) {
			this.transitionTo('community.participation');
		}

		return participationPack;
	}

	afterModel() {
		this.analytics.trackPiwikPageView(window.location.href);
		this.meta.addMetaTags({title: 'Community Introduction'});
	};


}
