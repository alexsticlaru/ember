import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import config from '../../config/environment';
import {action} from '@ember/object';

export default class CommunityParticipationRoute extends Route {
	@service analytics;
	@service meta;
	@service store;
	@service('user') userService;
	@service('community') communityService;
	@service('popup') popupService;
	@service loginRender;
	@service phone;
	@service('debug') dbgS;

	project;

	beforeModel(transition) {
		/*
		if(!this.userService.isAuthenticated) {
			transition.abort();
			this.transitionTo('community', transition.resolvedModels.community.community.url).then(() => {
				this.loginRender.renderDeviceSpecificLogin();
			});
		} else {
			this.userService.getCurrentUser((user) => {
				if (!user.emailConfirmed) {
					this.renderActivationEmail();
					transition.abort();
				}
			});
		}
		*/
	}

	renderActivationEmail() {
        if (window.innerWidth <= config.breakpoints.phone) {
            this.phone.showPhonePage('login-registration.phone.activation-mail-page', {}, 'login-registration.activation-mail');
        } else {
            this.popupService.showPopup('login-registration.activation-mail-popup', {}, undefined, 'login-registration.activation-mail');
        }
    }

	async model(params) {
		const community = this.modelFor('community').community;
		let projects = this.store.peekAll('project');
		if(!projects.length){//if not already loaded we query the backend
			 projects = await this.store.query('project', {
				 "filters[community]": community.id,
				 "filters[url]": params.participation_url
			 });
		}
		projects = projects.filter( project => {return (project.url == params.participation_url);} );
		const project = projects.firstObject;
		this.project = project;

		const participationPacks = this.store.query('participation-pack', {
			"filters[project]": project.id,
		});

		// for private projects and when the user is a project admin, prepare the Members list
		let projectMembers = [];
		if (project.private && this.userService.hasAccessToProject(project) && (this.userService.hasProjectAdminRights || this.userService.hasCommunityOwnerRights)   ) {
			projectMembers = this.store.query('project-following', {
				"filters[project]": project.id,
				"filters[status]": "active",
				"order_by[date]": "DESC",
				"limit": 3
			});
		}

		return RSVP.hash({
			project,
			participationPacks,
			community,
			participationUrl: params.participation_url,
			projectMembers
		});
	}

	afterModel(model) {
		this.communityService.setCurrentProject(this.project);
// alert('Community/participation route - afterModel');
		this.analytics.trackPiwikPageView(window.location.href);

		const title = model.project.name ? model.project.name : "Community Participation";
		const description = model.project.description ? model.project.description : "Participate at Civocracy";
		const image = model.project.image ? "https://res.cloudinary.com/civocracy/image/upload/" + model.project.image : "https://res.cloudinary.com/civocracy/image/upload/v1617286336/static/email-logo-pic.png";

		this.meta.addMetaTags({
			title,
			description,
			image
		});
	}

	@action
	error(e) {
		this.dbgS.error("Community/participation route - error(", e, ")");
		// backend returns 403 if accessing a private project
		if (e.errors && e.errors.firstObject.status === "403") {
			if (!this.userService.isAuthenticated) {
				this.transitionTo('login');
			} else {
				// redirect to project password prompt page
				this.replaceWith('community.access-project', this.project);
			}

		}else
			throw e;//bubble it to errorhandler
	}


}
