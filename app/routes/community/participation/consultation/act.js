import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';
import RSVP from 'rsvp';

export default class ActRoute extends Route {

	@service analytics;
	@service meta;
	@service phone;
	@service session;
	@service('popup') popupService;

	async model() {
		const consultation = this.modelFor('community.participation.consultation');
		const project = consultation.project;
		const participationPack = consultation.participationPack;
		const issue = await participationPack.issue;
		const issueId = issue.id;

		const assertions = this.store.query('assertion', {
			"filters[issue]": issueId,
			"order_by[globalRelevancy]": "DESC"
		});

		const profiles = this.store.query('issue-profile-stakeholding', {
			"filters[issue]": issueId
		});
		return RSVP.hash({
			issue,
			participationPack,
			project,
			assertions,
			profiles,
			community: consultation.community
		});
	}

	afterModel(model) {
		this.analytics.trackPiwikPageView(window.location.href);

		//Add Meta Tags for Sharing
		const title = model.community.name ? model.community.name + " - " + model.participationPack.title : "Civocracy";
		const description = model.issue.description ? model.issue.description : "Participate at Civocracy";
		const image = model.issue.image ? "https://res.cloudinary.com/civocracy/image/upload/" + model.issue.image : "https://res.cloudinary.com/civocracy/image/upload/v1617286336/static/email-logo-pic.png";

		this.meta.addMetaTags({
			title,
			description,
			image
		});
	}

}
