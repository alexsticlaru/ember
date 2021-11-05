import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class CodeOfConduct extends Route {
	@service('community') communityService;
	@service analytics;
	@service meta;

	beforeModel() {
		this.communityService.invalidateCurrentCommunity();
	}

	afterModel(model, transition) {
		transition.then(() => {
			this.analytics.trackPiwikPageView(window.location.href);
		});
		this.meta.addMetaTags({
			title: "Code of Conduct",
			description: "To ensure that a constructive frame for exchange is given where all users feel safe and respected, we ask our users to follow 10 golden rules.",
			image: "https://res.cloudinary.com/civocracy/image/upload/v1624280058/static/og-images/setup.png"
		});
	}

}
