import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ParticipationCustomRoute extends Route {

	@service analytics;
	@service meta;

	async model(params) {
		const _this = this;

		const participationPack = await this.store.findRecord('participation-pack', params.custom_id).catch(function(error) {
			_this.transitionTo('community.participation').then( function() {
				// _this.get("paperToaster").show("text");
			});
		});

		if (participationPack.get("url") != params.custom_url) {
			this.transitionTo('community.participation').then( function() {
				// _this.get("paperToaster").show("text");
			});
		}

		return participationPack;
	}

	afterModel() {
		this.analytics.trackPiwikPageView(window.location.href);
		this.meta.addMetaTags({title: 'Community Introduction'});
	};


}
