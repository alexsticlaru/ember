import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from "rsvp";
import { action } from '@ember/object';
import config from '../config/environment';

export default class CommunityRoute extends Route {
    @service analytics;
    @service meta;
    @service store;
	@service intl;
	@service toast;
	@service('community') communityService;
	@service('user') userService;
	@service('error-ember-consumer') errorEmberHandler;

	constructor(){
		super(...arguments);
		//we fire a load of the user asap:
		//this.userService.getCurrentUser();
	}

	async model(params) {
		const communities = await this.store.query('community', {
			"filters[url]": params.community_url,
			"v7": true,	 // v7 backend features, will do an url history search if the community url changed
		}).catch( error => {
//  			console.log('CATCH!', error);
			error.earlyCatch = true;
			this.errorEmberHandler.consume(error);
// 			throw error;
		});
		if (communities.length == 0) {
			// no community found - reject the promise, will be handled in error()
			return RSVP.reject('not_found');
		}
		const community = await communities.firstObject;
		const projects = await this.store.query('project', {
			"filters[community]": community.id
		}).catch(error => {
// 			console.log('CATCH!', error);
			error.earlyCatch = true;
			this.errorEmberHandler.consume(error);
			// 			throw error;
		});
		this.communityService._communityProjects = projects;//we don't want communityService to load again the community's projects
		return RSVP.hash({
			community,
			projects
		});
	}

    afterModel(model, transition) {

		// redirect V6 communities to the old platform
		/**/
		if (config.APP.V6_REDIRECT_HOST && model.community.v7redirect !== true) {
			window.location.replace(config.APP.V6_REDIRECT_HOST + '/' + model.community.url);
			transition.abort();
			return;
		}
		/**/

		if ( model.community ) {
			this.communityService.setCurrentCommunity(model.community);
		}

		// if the community has a different url than the one we asked, that means the url has changed
		if (model.community.url.toLowerCase() !== this.paramsFor(this.routeName).community_url.toLowerCase()) {
			// redirect to the new correct url
			this.transitionTo('community', model.community.url);
		}

    this.analytics.trackPiwikPageView(window.location.href);

    //Add Meta Tags for Sharing
    const title = model.community.name ? model.community.name + ' - Civocracy' : "Civocracy";
    const description = model.community.description ? model.community.description: "Participate at Civocracy";
    const image = model.community.cover ? "https://res.cloudinary.com/civocracy/image/upload/" + model.community.image : "https://res.cloudinary.com/civocracy/image/upload/v1617286336/static/email-logo-pic.png";

    this.meta.addMetaTags({
      title,
      description,
      image
    });

  }

    @action
	error(e) {

		// not_found error in model, community not found
		if (e === 'not_found') {
			this.transitionTo("home").then(() => {
				this.toast.error(this.intl.t('bubble.notfound.community'));
			});
		}
	}

}
