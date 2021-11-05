import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import Ember from 'ember';
import { action, get } from '@ember/object';

export default class Application extends Route {

// 	@service customer;
	@service intl;
	@service('popup') popupService;
	@service('phone') phoneService;
	@service('community') communityService;
	@service session;
	@service('user') userService;
    @service cookies;
	@service('debug') dbgS;
	@service sidePanel;
	@service router;
	@service ('error-ember-consumer') errorEmberConsumer;

	modelRefreshDeferred = false;
	//
	// Polling configuration
	//
	// Poll for new comments ?
	polling = false;
	// Polling interval (ms)
	pollingInterval = 10000;
	// Time when the last request was sent
	timestamp = null;
	// Polling timer
	timer = null;

	themes = null;

	constructor(){
		super(...arguments);
		const _this = this;
		//! ACCESSIBILITY HANDLER :: activate borders on focused elements
		$(window).on("keydown", (event) => {
// 			console.log('event:', event);
// 			alert('event:' + event);
			if( Ember.$('body').hasClass('accessibility-mode') )
				return;
			const skipHandle = ['textarea', 'input'];
			if( !skipHandle.includes(event.target.tagName) && event.originalEvent.keyCode === 9 )
				Ember.$('body').addClass('accessibility-mode');
		});
		//! :: ACCESSIBILITY HANDLER
		this.get('session').init();
		this.get('dbgS');//starting dbgS
		this.userService.on("userRightsChanged", this._userRightsChanged.bind(this));
		this.set('errorEmberConsumer.application_route', _this);
		this.popupService.setPopupRenderer(this);
		this.phoneService.setPhoneRendererRoute(this);
		this.sidePanel.setSidePanelRendererRoute(this);

// 		this.userService.getCurrentUser( this._userIsNowLogged.bind(this) );
		const user = this.userService.getCurrentUserAsync().then( user => {this.dbgS.log('END getCurrentUserAsync', user);});

		this.get('intl');//starting intl
		this.get('communityService');//starting communityService
		//can we do this on just some routes?
		this.router.on('routeDidChange', transition => {
			//excluding settings route because of bad ux
			if (transition.to.name.includes("settings")) {
				// window.scrollTo(0, 0);
			} else if (transition.to.name.includes("proposition")) {
				// window.scrollTo(0, 0);
			} else {
				window.scrollTo(0, 0);
			}
		});
/*
		//Special redirects :
		if( window.location.pathname.indexOf("civocracy.org/transporthandicap") ){
			this.transitionTo('participation', 'auvergne-rhone-alpes/transporthandicap') ;
		}
*/
	}

	_userIsNowLogged(user){
		//! Even if the user is not logged right now, this method will be called as soon the user log-in or sign-in
		this.loadNotifications();//load user's notifications
	}
	/**
	 * Try to restore session on page refresh.
	 */
	beforeModel(transition) {
		this.dbgS.notifyBeforeModel("routes application");
		this.setupDebugMode(transition);
		/*::debug get vars control*/
		// Update timestamp
		// With 1 second margin to handle: http://bit.ly/2waS2LI
		this.timestamp = moment().subtract(1, 'seconds').toISOString();

		//Static redirs for AURA's projects :
		if( window.location.toString().indexOf('.org/transporthandicap') >= 0 ){
			this.dbgS.log("Redirecting " + window.location.toString() + " to /auvergne-rhone-alpes/transporthandicap");
			window.document.location = "/auvergne-rhone-alpes/transporthandicap";
		}
		if( window.location.toString().indexOf('.org/ressources-partenaires-aura') >= 0 ){
			this.dbgS.log("Redirecting " + window.location.toString() + " to /auvergne-rhone-alpes/ressources-partenaires-aura");
			window.document.location = "/auvergne-rhone-alpes/ressources-partenaires-aura";
		}
	}

	setupDebugMode(transition) {
		if( transition.to.queryParams.debugmode!==null && transition.to.queryParams.debugmode!==undefined )
			this.dbgS.forceDebugMode( transition.to.queryParams.debugmode );
		/**/
		if( transition.to.queryParams.v7stringsreport!==null && transition.to.queryParams.v7stringsreport!==undefined )
			this.dbgS.forceV7StringsReport( transition.to.queryParams.v7stringsreport );
		/**/
		if( transition.to.queryParams.debug_showEachAdaptersRequest!==null && transition.to.queryParams.debug_showEachAdaptersRequest!==undefined )
			this.dbgS.forceDebugShowEachAdaptersRequest( transition.to.queryParams.debug_showEachAdaptersRequest );
		/**/
		if( transition.to.queryParams.debug_dontShowBubbles!==null && transition.to.queryParams.debug_dontShowBubbles!==undefined )
			this.dbgS.forceDebugDontShowBubbles( transition.to.queryParams.debug_dontShowBubbles );
		/**/
		if( transition.to.queryParams.debug_forceDontPollNotifications!==null && transition.to.queryParams.debug_forceDontPollNotifications!==undefined )
			this.dbgS.forceDontPollNotifications( transition.to.queryParams.debug_forceDontPollNotifications );
	}

	/**
	 * Get model for hamburger menu content.
	 */
	model() {
		this.dbgS.notifyModel("routes application");
		//Initially we were loading the user's notifications here but actually we don't already knows the user's id then it was of no use (the backend was queried without uid, leading to a world-wide non filtered notification list and slowing the rendering) => work in progress as for now we don't have the bell/notification list displayed on page
		return [];
	}

	afterModel() {
		this.dbgS.notifyAfterModel("routes application");
		this.polling = true;
		RSVP.resolve();
	}

	_userRightsChanged(){
this.dbgS.error("_userRightsChanged()", this.router.currentRouteName);
		//redir if on a setting route with no right
		if( !this.router.currentRouteName )return;
		if( (this.router.currentRouteName.includes('community.settings') || this.router.currentRouteName.includes('community.add-project')) && !this.userService.hasCommunityOwnerRights ){
			this.dbgS.log('routes community settings _userRightsChanged => transitionTo(community)', trace());
			this.dbgS.alert("routes community settings _userRightsChanged => transitionTo('community')");
			this.transitionTo('community');
		}else if( this.router.currentRouteName.includes('community.participation.settings') && !this.userService.hasCommunityOwnerRights ){
			this.dbgS.log('routes community participation settings _userRightsChanged => transitionTo(community.participation)', trace());
			this.dbgS.alert("routes community participation settings _userRightsChanged => transitionTo('community.participation')");
			this.transitionTo('community.participation');
		}
	}

	loadNotifications(){
		return;
		let userId = this.userService.currentUser.id;
		let newNotifications = null;
		let earlierNotifications = null;
		if (this.userService.isAuthenticated && userId) {
			//this need to be called after the user is authenticated and loaded by the user service
			newNotifications = this.store.query('notification', {
				modelPath: 'controller.model.notifications',
				"filters[user]": userId,
				"order_by[date]": "DESC",
				"limit": "3"
			});
			earlierNotifications = this.store.query('notification', {
				modelPath: 'controller.model.notifications',
				"filters[user]": userId,
				"filters[importance]": 4,
				"order_by[new]": "DESC",
				"limit": "3"
			});
			this.model = RSVP.hash({
				newNotifications,
				earlierNotifications
			});

		}
		return [];
	}

	/**
	 * Starts or stops the comments polling timer,
	 * according to the `polling` boolean.
	 * @method triggerPolling
	 * TODO FIXME: current user datas are queried too much frequently, one time each 30 secs should be enough...
	 */
	// triggerPolling = observer('polling', function () {
	// 	// Disable polling in test mode
	// 	if (Ember.testing || this.get('dbgS')._dontPollNotifications) {
	// 		return;
	// 	}
	// 	if (this.get('polling')) {
	// 		// (Re)schedule polling
	// 		const timer = run.later(this, function () {
	// 			if ( this.get('session.isAuthenticated') ) {
	// 				this.pollUserAndNotifications()
	// 					.then(this.insertNotifications.bind(this));
	// 			}
	// 			this.triggerPolling();
	// 		}, this.get('pollingInterval'));
	// 		this.set('timer', timer);
	// 	} else if (this.get('timer')) {
	// 		// Cancel scheduled polling
	// 		run.cancel(this.get('timer'));
	// 		this.set('timer', null);
	// 	}
	// })

	/**
	 * Sends a comments polling request.
	 * @method pollComments
	 * @return {Promise} resolving to the new comments
	 */
	pollUserAndNotifications() {
// 		if( !this.get('session.isAuthenticated') )return;
		if( !this.userService.isAuthenticated || !this.userService.getCurrentUser() )return;
		if (Ember.testing || this.get('dbgS')._dontPollNotifications) {
			return;
		}
		// Update timestamp
		// With 1 second margin to handle: http://bit.ly/2waS2LI
		this.set('timestamp', moment().subtract(1, 'seconds').toISOString());
		// Send request
		const user = this.store.findRecord('user', this.get('session.currentUser.id'), { reload: true });
		user.then( function () {
		});
		const promise = this.store.query('notification', {
			modelPath: 'controller.model.notifications',
			"filters[user]": this.get('session.currentUser.id'),
			"order_by[date]": "DESC",
			"limit": "3"
		});


		return promise;
	}

	insertNotifications(newNotifications) {
		const _this = this;
		if( (!this.get('controller.model.newNotifications') || this.get('controller.model.newNotifications.content.length') < 1) && (!this.get('controller.model.earlierNotifications') || this.get('controller.model.earlierNotifications.content.length') < 1 ) ){
			this.loadNotifications();
		}
		if(this.get('controller.model.newNotifications') && this.get('controller.model.newNotifications.content.length') > 0) { // controller.model.newNotifications is not set if the user just registered
			const modelNotificationsArray = this.get('controller.model.newNotifications').toArray();
			modelNotificationsArray.addObjects(this.get('controller.model.newNotifications'))

			newNotifications.forEach(function (notification) {
				if (!modelNotificationsArray.includes(notification)) {
					_this.get('controller.model.newNotifications').unshiftObject(notification._internalModel);
					_this.get('controller.model.newNotifications').popObject();
				}
			});
		} else {
			newNotifications.forEach(function (notification) {
				if( _this.get('controller.model.newNotifications') )
					_this.get('controller.model.newNotifications').unshiftObject(notification._internalModel);
			});
		}

	}

	flat_popup_render(template, model, controllerName) {
		// Render template for the popupService
this.dbgS.log("flat_popup_render(", template, model, controllerName, ")");
		const controller = controllerName ? controllerName : template;
		this.render(template, {
			into: 'application',
			outlet: 'flat-popup',
			controller: controller,
			view: template,
			model: model
		}) ;
	}

	phone_page_render(template, model, controllerName) {
		const controller = controllerName ? controllerName : template;
		this.render(template, {
			into: 'application',
			outlet: 'phone',
			controller: controller,
			view: template,
			model: model
		}) ;
	}

	side_panel_render(template, model, controllerName) {
		const controller = controllerName ? controllerName : template;
		this.render(template, {
			into: 'application',
			outlet: 'side-panel',
			controller: controller,
			view: template,
			model: model
		});
	}

	/*
	 * Transitions.
	*/
	@action
	transitionToUser(username) {
		this.transitionTo('user', username);
		return false ;
	}

	/*
     * Error handler.
	*/

	@action
	error(error, transition) {
			this.dbgS.notify("application route error !", error, transition);
			if (error.errors) {
				const errorStatusCode = error.errors[0].status;
				const intl = this.intl;
				if (errorStatusCode == '401') {
					localStorage.clear();
					this.session.close();

					this.toast.warning(
						intl.t('bubble.login.error.401'),
						intl.t('bubble.error.account.title')
					);
					transition.abort();

					this.transitionTo('home', {
						queryParams: {
							showLogin: true
						}
					});
					return true;
				}
			}

			// In some weird situations, errors arrive here
			// but don't bubble properly. This print allows
			// us to notice them anyways.

			const communityRoute = 'community';
			const community = this.communityService.getCurrentCommunity ;

			/* DEPRECATED ! May be also for the rest of this code ??
			 * if (
				this.customer.isFriendsOfEurope && !window.location.pathname.includes('dsplus')
			) {
				this.transitionTo(communityRoute, 'dsplus') ;
			} else
			*/
			if (
				community && !window.location.pathname.includes(community.url)
			) {
				this.transitionTo(communityRoute, community.url) ;
			} else {
				this.transitionTo('home') ;
			}

			return true ; // bubble error to ember for better console logs.
	}
}
