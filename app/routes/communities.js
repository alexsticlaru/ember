import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CommunitiesRoute extends Route {

	@service analytics;
	@service meta;
	@service ('user') userService;

	model() {
		const communities = this.store.query('community', {
			"order_by[best]": "DESC",
			"filters[isActive]": 1,
			"filters[isSubpage]": 0,
			"specialFilters[communityTree]": 1,
			"limit": "100"
		});


		if(this.userService.isAuthenticated) {
			this.userService.getCurrentUser((user) => {
				this.store.queryRecord('community-following', { "filters[user]": user.id });
			})
		}

		return communities;
	}

	afterModel() {
		this.analytics.trackPiwikPageView(window.location.href);

		const title = "Communities";
		const description = "Civocracy communities gather people to think together and find solutions for important local matters";
		const image = "https://res.cloudinary.com/civocracy/image/upload/v1617286336/static/email-logo-pic.png";

		this.meta.addMetaTags({
			title,
			description,
			image
		});
	}



}
