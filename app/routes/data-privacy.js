import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class DataPrivacy extends Route {
// 	@service customer;
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
			title: "Privacy Notice",
			description: "Your data is important! So it is essential that you understand how we process your data on the Civocracy platform.",
			image: "https://res.cloudinary.com/civocracy/image/upload/v1624280058/static/og-images/participate.png"
		});
	}
}
