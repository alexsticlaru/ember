 import Route from '@ember/routing/route';
 import { inject as service } from '@ember/service';
 import config from '../../../../../config/environment';

 export default class ActContributionRoute extends Route {
	@service analytics;
	@service meta;
	@service phone;
	@service session;
	@service('popup') popupService;
	@service router;

	constructor() {
		super(...arguments);
		this.router.on('routeWillChange', (transition) => {
			if (window.innerWidth <= config.breakpoints.phone && transition.targetName === 'community.participation.consultation.act.index') {
				const actModel = this.modelFor('act');
				this.phone.showPhonePage('community.participation.consultation.act.phone.consultation-act', actModel, 'community.participation.consultation.act');
			}
		});
	}

	async model(params) {
		// we need to do a check if the comment has an issue and
		// if this issue is the same as the query params of the parent route
		// so we can filter out replys and contributions from other communitys
		//
		// and also some redirect or empty page if not found would be good

		// const comment = this.store.peekRecord('comment', params.contribution_id);
		// return comment === null ? this.store.findRecord('comment', params.contribution_id) : comment;

		// need to always reload the contribution, otherwise it might not have all the replies/comments attached to it
		return this.store.findRecord('comment', params.contribution_id);
	}

	afterModel(model) {
		this.analytics.trackPiwikPageView(window.location.href);

    //Add Meta Tags for Sharing
    const act = this.modelFor('community.participation.consultation.act');
		const title = act.community.name ? act.community.name + " - " + act.participationPack.title : "Civocracy";
		const description = model.title ? model.user.get("fullName") + ": - " + model.title : "Participate at Civocracy";
		const image = act.issue.image ? "https://res.cloudinary.com/civocracy/image/upload/" + act.issue.image : "https://res.cloudinary.com/civocracy/image/upload/v1617286336/static/email-logo-pic.png";

		this.meta.addMetaTags({
			title,
			description,
			image
		});

	}

	renderTemplate(controller, model) {
		if (window.innerWidth <= config.breakpoints.phone) {
			this.phone.showPhonePage('contribution-item/phone/contribution-item', model, 'contribution-item');
		} else {
			this.render();
		}
	}

}
