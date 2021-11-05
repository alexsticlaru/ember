import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class CommunityParticipationSettingsRoute extends Route {
	@service('user') userService;
	@service('debug') dbgS;
	@service session;
	@service router;
	@service analytics;
	@service meta;

	constructor(){
		super(...arguments);
		const _this = this;
		/* The application route takes care of redirecting the user
		this.session.on('invalidationSucceeded', function() {
			_this._handlerInvalidationSucceeded(...arguments);
		});
		*/
		this.userService.on("userRightsChanged", this._userRightsChanged.bind(this));
	}

	async model() {
		const projectAdmins = this.store.query('project-following', {
			filters: {
				"adminLevel": [1, 2],
				"project.id": this.modelFor('community.participation').project.id,
				"status": "active",
			},
			limit: 100
		});

		const communityAdmins = this.store.query('community-following', {
			filters: {
				"adminLevel": [1, 2],
				"community.id": this.modelFor('community.participation').community.id,
				"status": "active",
			},
			limit: 100
		});

/* not needed anymore ?
		//this here is a fix because otherwise the updates route was not showing the updates proberly
		//no idea why this is necessary...
		const projectUpdates =[];
		this.modelFor('community.participation').project.sortedProjectUpdates.forEach((item) => {
			projectUpdates.pushObject(item);
		});
		const project = this.modelFor('community.participation').project;
		project.projectUpdates = projectUpdates;
		//Until here
*/
		const project = this.modelFor('community.participation').project;

		return RSVP.hash({
			project,
			participationPacks: this.modelFor('community.participation').participationPacks,
			community: this.modelFor('community.participation').community,
			projectAdmins,
			communityAdmins,
		});
	}

	afterModel(model) {
		const _this = this;
		this.userService.getCurrentUserAsync(this._userRightsChanged.bind(this));
		/**/
		this.analytics.trackPiwikPageView(window.location.href);
		this.meta.addMetaTags({title: 'Project Settings'});
	}

	_userRightsChanged(){
		// 		console.log("community.participation.settings route _userRightsChanged() - currentRoute=", this.router.currentRoute," - currentRouteName=", this.router.currentRouteName," - this.userService.hasCommunityOwnerRights=", this.userService.hasCommunityOwnerRights);
		if( ( !this.router.currentRouteName || this.router.currentRouteName.includes("community.participation.settings") ) && !this.userService.hasCommunityOwnerRights ){
this.dbgS.log('community/participation/settings redir _userRightsChanged !', trace());
this.dbgS.alert('community/participation/settings redir _userRightsChanged!');
			this.transitionTo('community.participation');
		}
	}

// 	_handlerInvalidationSucceeded(){
// this.dbgS.console.log('community/participation/settings redir _handlerInvalidationSucceeded !', trace());
// this.dbgS.alert('community/participation/settings redir _handlerInvalidationSucceeded!');
// 		this.transitionTo('community.participation');
// 	}

}
