import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class CommunitySettingsRoute extends Route {
    @service analytics;
    @service meta;
	@service('user') userService;
	@service('debug') dbgS;
	@service session;
	@service router;

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
		const community = this.modelFor('community').community,
			admins = this.store.query('community-following', {
        filters: {
          "adminLevel": [1, 2],
          "community.id": community.id,
          "status": "active",
        },
        limit: 100
      });
      return RSVP.hash({
        community: community,
        admins: admins,
      });
    }

    afterModel(model) {
		const _this = this;
		this.userService.getCurrentUserAsync(/*this._userRightsChanged.bind(this)*/);
		this.analytics.trackPiwikPageView(window.location.href);
		this.meta.addMetaTags({title: model.community.name + ' - Community Settings'});
    }

    _userRightsChanged(){
		// 		console.log("_userRightsChanged() - currentRoute=", this.router.currentRoute," - currentRouteName=", this.router.currentRouteName," - this.userService.hasCommunityOwnerRights=", this.userService.hasCommunityOwnerRights);
		if( ( !this.router.currentRouteName || this.router.currentRouteName.includes("community.settings") ) && !this.userService.hasCommunityOwnerRights ){
this.dbgS.log('community/settings redir _userRightsChanged !', trace());
this.dbgS.alert('community/settings redir _userRightsChanged!');
			this.transitionTo('community');
		}
	}

//     _handlerInvalidationSucceeded(){
// this.dbgS.log('community/settings redir _handlerInvalidationSucceeded !', trace());
// this.dbgS.alert('community/settings redir _handlerInvalidationSucceeded!');
// 		this.transitionTo('community');
// 	}
}
