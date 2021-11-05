import Service, { inject as service } from '@ember/service';
import config from 'civ/config/environment';
import { tracked } from "@glimmer/tracking";
import { later, cancel } from '@ember/runloop';
import { computed, observer } from '@ember/object';
import RSVP from 'rsvp';
import MutableArray from '@ember/array/mutable';
const { APP: { USER } } = config ;

/**
 * This service is made to centralize user datas for components

 * Usages for community admins :

 **** Is the user an owner for the current community :
 * Inject the user service <code>@service('user') userService;</code> then test directly userService.hasAdminRights in your template :
 * <code>
      {{#if this.userService.hasCommunityOwnerRights}}
        You are an owner for the community !
      {{/if}}
 * </code>

 **** Is the user an admin for the current project :
 * Inject the user service <code>@service('user') userService;</code> then test directly userService.hasProjectAdminRights in your template :
 * <code>
      {{#if this.userService.hasProjectAdminRights}}
        You are an admin for the project !
      {{/if}}
 * </code>

 **** Can the user edit the current project :
 * Here we need to check both hasProjectAdminRights and hasCommunityOwnerRights to enforce the intended behavior : community owers always can edit all the community's projects
 * <code>
	{{#if (or this.userService.hasProjectAdminRights this.userService.hasCommunityOwnerRights)}}
		You can edit the project !
	{{/if}}
 * </code>
 */

export default class UserService extends Service {
	@service store;
	@service session;
	@service('popup') popupService;
	@service('community') communityService;
	@service('debug') dbgS;
	@service loginRender;

	@tracked currentUser = null;
	//@tracked hasCommunityOwnerRights;
	@tracked hasCommunityOwnerRights;
	@tracked hasProjectAdminRights;

// 	@tracked showActivationBanner;

	@computed('currentUser', 'currentUser.emailConfirmed')
	get showActivationBanner(){
// 		console.log('showActivationBanner() return ' + (!this.currentUser.emailConfirmed) );
		return this.currentUser && (!this.currentUser.emailConfirmed);
	}

	@tracked pendingAuthentication = false;//This is to be used in internal debugging : if true it means an OAuth2 is currently processed - As a tracked it may also be used in external like for an animation running while an auth is processed (only in read mode, no direct value changes should be done externally !).

	//! the pending will become false only after full handling, success/failure callbacks calls included.
	_pendingAuthentication_mail = null;
//	_sessionisAuthenticated = computed.readOnly('session.isAuthenticated');

	_intern_currentUser = false;//not tracked ! this is to avoid some magic that may forever loop our service

	/* Main frontend methods ::*/

	@computed('communityService.currentCommunity')
	get currentCommunity(){
this.dbgS.log("USER SERVICE currentCommunity:", this.communityService.currentCommunity);
		return this.communityService.currentCommunity;
	};

	setCurrentCommunity(community){
		this.dbgS.log("USER SERVICE setCurrentCommunity(", community, ");", trace());
		//called by routes/community.js and/or communityService to warn for changes as tracked/computed seems not to work fine in services (?)
		this._computeAdminRights();
	}

	@computed('communityService.currentProject')
	get currentProject(){
		this.dbgS.log("USER SERVICE currentProject:", this.communityService.currentProject);
// this.dbgS.log("USER SERVICE currentProject:", this.communityService.currentProject);
		return this.communityService.currentProject;
	};

	setCurrentProject(project){
		this.dbgS.log("USER SERVICE setCurrentProject(", project, ");");
		//called by routes/community/participation.js to warn for changes as tracked/computed seems not to work fine in services (?)
		this._computeAdminRights();
	}

// 	@computed('session.isAuthenticated')
	get isAuthenticated(){
this.dbgS.error("userService get isAuthenticated() returns :", this.session.isAuthenticated);
		if ( this.session.isAuthenticated && !this._intern_currentUser && window.localStorage.getItem('userId') ) {
			this.loadCurrentUserById(window.localStorage.getItem('userId'));
		}
		return this.session.isAuthenticated;
	};



	/** @@method getCurrentUserAsync( callbackWhenUserResolved )
	 * @@descript: This is the frontend to get the user object. If it is not already loaded it will be in a promise and we can't await the loading without drawbacks => the callbackWhenUserResolved argument allows the caller to be notified and execute other things when the user will be available. Of course an other approach is still possible by using the tracked currentUser property.
	 * @@arguments:
	 * @callbackWhenUserResolved : if the user is not already loaded we store this callbacks in an array and they will be called (and removed) once the user is resolved. The callback can optionnaly take 2 arguments : (user, error) - NB: this logic is similar than the userService.on('userResolved', callback) but the difference is that the callbackWhenUserResolved will be called only once and will then been removed from the stack. As for on() the event callback will be called each time the user is resolved if it is multiple times.
	 */
	async getCurrentUserAsync(callbackWhenUserResolved){
		if( this._intern_currentUser ){
			//if the user is yet known as logged-in we return it now and also call the callback
			this.dbgS.log( "getCurrentUserAsync() return A :", this._intern_currentUser );
			if(!this.currentUser)
				this.currentUser = this._intern_currentUser;
			if(callbackWhenUserResolved)
				callbackWhenUserResolved(this._intern_currentUser );
			return this._intern_currentUser;
		}
		const uid = window.localStorage.getItem('userId');
		if( callbackWhenUserResolved && !this._userResolvedCallbacks.includes(callbackWhenUserResolved) ){
			//pushing the callback in the list if does not exists already
			this.dbgS.log("getCurrentUserAsync() - uid:"+uid+" - ADDING CBACK callbackWhenUserResolved=\n", callbackWhenUserResolved, "\n_userResolvedCallbacks{" + this._userResolvedCallbacks.length + "}=", this._userResolvedCallbacks);
			this._userResolvedCallbacks.push(callbackWhenUserResolved);
		}

// 		if( !this._intern_currentUser && this.isAuthenticated && uid ){
		if( uid && !this._intern_currentUser ){
			this.dbgS.log( "getCurrentUserAsync() loading:" + uid );
			await this.loadCurrentUserById(uid, callbackWhenUserResolved);
		}
		if(!this._intern_currentUser)
			this._computeAdminRights();
this.dbgS.log("getCurrentUserAsync session.isAuthenticated:", this.session.isAuthenticated);
		return this._intern_currentUser;
	}

	/** @@method getCurrentUser( callbackWhenUserResolved )
	 * @@descript: This is the frontend to get the user object. If it is not already loaded it will be in a promise and we can't await the loading without drawbacks => the callbackWhenUserResolved argument allows the caller to be notified and execute other things when the user will be available. Of course an other approach is still possible by using the tracked currentUser property.
	 * @@arguments:
	 * @callbackWhenUserResolved : if the user is not already loaded we store this callbacks in an array and they will be called (and removed) once the user is resolved.
	 */
	_userResolvedCallbacks = [];
	getCurrentUser( callbackWhenUserResolved ) {

// return;//temp test async

		if( this._intern_currentUser ){
this.dbgS.log( "getCurrentUser() return A :", this._intern_currentUser );
			if(!this.currentUser)
				this.currentUser = this._intern_currentUser;
			return this._intern_currentUser;
		}
		let uid = window.localStorage.getItem('userId');
		/**/
// this.dbgS.warn("getCurrentUser() - uid:"+uid+" - ", callbackWhenUserResolved);
		if( callbackWhenUserResolved && this._userResolvedCallbacks.indexOf(callbackWhenUserResolved) < 0 ){
this.dbgS.log("getCurrentUser() - uid:"+uid+" - ADDING CBACK callbackWhenUserResolved=\n", callbackWhenUserResolved, "\n_userResolvedCallbacks{" + this._userResolvedCallbacks.length + "}=", this._userResolvedCallbacks);
			this._userResolvedCallbacks.push(callbackWhenUserResolved);
		}
		/**/
/*this.dbgS.log( "getCurrentUser() uid:" + uid );
this.dbgS.log( "getCurrentUser session:" + this.session );
this.dbgS.log( "getCurrentUser session.isAuthenticated:" + this.session.isAuthenticated );
this.dbgS.log( "getCurrentUser isAuthenticated:" + this.isAuthenticated );
this.dbgS.log( "getCurrentUser _intern_currentUser:" + this._intern_currentUser );
*/
		if( !this._intern_currentUser && this.isAuthenticated && uid ){
this.dbgS.log( "getCurrentUser() loading:" + uid );
			this.loadCurrentUserById(uid, callbackWhenUserResolved);
		}/*else if( !uid || (this.session && !this.isAuthenticated) ){
this.dbgS.log( "getCurrentUser() - invalidateCurrentUser() -> ( " + (!uid) + " || ("+(this.session)+" && !"+(this.isAuthenticated)+")" );
			this.invalidateCurrentUser();
		}*/
this.dbgS.log( "getCurrentUser() return B :", this._intern_currentUser );
		if( this._intern_currentUser )
			return this._intern_currentUser;
		else{
			return null;
		}
	};

	logout(){//alias
this.dbgS.log("userService.logout()");
		this.invalidateCurrentUser();
	}

	/**
	 * sync login session data to the formal v6 version of the platform, so the user is authenticated in both places at once
	 */
	syncLogin() {
		// check if feature is enabled in the current environment
		if (!config.APP.LOGIN_SYNC_HOST) {
			return;
		}

		const url = config.APP.LOGIN_SYNC_HOST + '/sync-login.html';
		const iframeId = 'ifr_sync';

		// did we insert an iframe previously?
		let iframe = document.getElementById(iframeId);
		if (iframe) {
			this._iframeSendLoginData(iframe);
			return;
		}

		// insert an iframe to the target platform
		iframe = document.createElement('iframe');
		iframe.id = iframeId;
		iframe.style.display = "none";
		iframe.src = url;
		document.body.appendChild(iframe);
		// wait for the iframe to load, then send data
		iframe.onload = () => {
			this._iframeSendLoginData(iframe);
		}

	}

	async createNewUser(newUser) {
		const user = this.store.createRecord('user', newUser);
		return this.currentUser = this.set('_intern_currentUser', await user.save());
	};

	invalidateCurrentUser() {
// this.dbgS.log("invalidateCurrentUser()", trace());
		this.set('currentUser',undefined);
		this.set('_intern_currentUser',undefined);
		this._userProjects = [];
		this._userCommunities = [];
		this.pendingAuthentication = false;
		this._pendingAuthentication_mail = null;
		this.session.invalidate();
		// manually cleaning the session from the browser as in some cases it is not done (should happen to dev only when switching the local server from 2 environment using different backoffices)
		window.localStorage.removeItem('civocracy:session');
		//window.localStorage.getItem('userId')
		this.syncLogin();
	}
	/*:: Main frontend methods*/

	showLogin() {
		this.loginRender.renderDeviceSpecificLogin();
	}

	showActivationEmailPopup() {
      this.loginRender.renderActivationEmailPopup();
    }

	constructor() {
		super(...arguments);
// 		this.currentCommunity = this.currentCommunity;//sync with the community service changes
		/*Handling sessions events to update currentUser*/
		const _this = this;
		/*Syncing localStorage between tabs :*/
		window.addEventListener('storage', (e) => {
			if( !e.key || e.key.indexOf('test') > 0)return;
			this.dbgS.log(`Key Changed: ${e.key}\nNew Value: ${e.newValue}\n`+JSON.parse(window.localStorage.getItem('userId')));
			//if( window.localStorage.getItem(e.key) !== e.newValue ){
				window.localStorage.setItem(e.key, e.newValue);
				if(e.key === "userId"){
					this.loadCurrentUserById( e.newValue );
				}
			//}
		});
		/**/
		this.session.init();
		/*Ember session events handlers :*/
		this.session.on('authenticationSucceeded', function() {
			_this._handlerAuthenticationSucceeded(...arguments);
		});
		this.session.on('invalidationSucceeded', function() {
			_this._handlerInvalidationSucceeded(...arguments);
		});
		/**/
//this.session.isAuthenticated
		this.dbgS.log("userService.constructor() - this.session {isAuthenticated=" + this.isAuthenticated + "}:", this.session);

		if (this.isAuthenticated) {
			this.dbgS.log("window.localStorage.getItem('userId'):", window.localStorage.getItem('userId'));		//Preloading when user is ready
			this._loadUserProjects();
			this._loadUserCommunities();
		} else this.dbgS.log("userService.constructor() - NOT AUTHENTICATED");
	}

	init(){
this.dbgS.log('user service init()');
		super.init(...arguments);
this.dbgS.log("userService.init() - this.session {isAuthenticated="+this.isAuthenticated+"}:", this.session);
		if( this.isAuthenticated ){
			this.dbgS.log("window.localStorage.getItem('userId'):", window.localStorage.getItem('userId'));
		}else this.dbgS.log("userService.init() - NOT AUTHENTICATED");
	};

	/**
	 * use the postMessage API to send data to the other platform
	 * @param iframe
	 */
	_iframeSendLoginData(iframe) {
		var win = iframe.contentWindow;
		const userId = window.localStorage.getItem('userId');
		let data = null;
		if (userId) {
			const session = JSON.parse(window.localStorage.getItem('ember_simple_auth-session'));
			data = {
				'access_token': session.authenticated.access_token,
				'refresh_token': session.authenticated.refresh_token,
				'expires_at': session.authenticated.expires_at,
				'userId': userId
			}
		}
		this.dbgS.log('sending data', data);
		win.postMessage(data, config.APP.LOGIN_SYNC_HOST);
	}

	/*AUTH LOGIC :*/
	//If the auth process doesn't answer quickly, we'll stop it and throw an error
	_waitForAuth_tout = null;
	//In case of multiple calls to authenticate (should not an usual case), we are prepared to notify each callers
	_authSuccessCallbacks = [];
	_authFailureCallbacks = [];

	// authenticate() is async only for the initialisation of session.authenticate() - this method will return once session sends the OAuth query to the back-end or if session fails before that (in that case of failure a try block can be used for the caller script to catch the error and anyway the failureCallback will be also called).
	// The following of the auth process is done through the authenticationSucceeded and invalidationSucceeded events are fired by ember-simple-auth therefore. Meanwhile there is no automatic awaiting from any part.
	async authenticate(identification, password, successCallback, failureCallback ){
this.dbgS.log( 'authenticate START ' + new Date() );
		if( this._authSuccessCallbacks.indexOf(successCallback) < 0 )
			this._authSuccessCallbacks.push(successCallback);
		if( this._authFailureCallbacks.indexOf(failureCallback) < 0 )
			this._authFailureCallbacks.push(failureCallback);

		if( this.pendingAuthentication ){
			//no error for that as the caller will be informed of user's authentication when resolve : throw new Error("An auth is already pending");
			return;
		}
		this.pendingAuthentication = true;
		this._pendingAuthentication_mail = identification;

		//When the user's datas are fully loaded, in the case of authenticate we need to call this._authEnded through a callback here
		const cbackAuthEnded = this._authEnded.bind(this);
		if( this._userResolvedCallbacks.indexOf(cbackAuthEnded) < 0 )
			this._userResolvedCallbacks.unshift(cbackAuthEnded);

// 		const _this = this;
		//As a security we set a maximum 60 secs timeout for the OAuth process to end or we will cancel it anyway and notify the initiator component of a failure
		this._waitForAuth_tout = later(this, function(){
			/*this.pendingAuthentication = false;
			this._pendingAuthentication_mail = null;
			this._handlerAuthenticationFailure(new Error("Timeout for the current auth process!"));*/
this.dbgS.error("authenticate : session took too long to start - this.invalidateCurrentUser()");
			if( this.isAuthenticated )return;
			this.invalidateCurrentUser();
			this.s(null, new Error("Timeout for the current auth process!") );
		}, 60000);

		try {
this.dbgS.log( 'authenticate PENDING ' + new Date() );
			await this.session.authenticate('authenticator:oauth2', identification, password);
		} catch(error) {
			this._handlerAuthenticationFailure(error);
		}
this.dbgS.log( 'authenticate RETURN ' + new Date() );
	};

	/*Ember-simple-auth events handlers (no need for route or login components handling) ::*/
	async _handlerAuthenticationSucceeded(){
		cancel(this._waitForAuth_tout);
 		this.dbgS.log('_handlerAuthenticationSucceeded(', arguments, ')\nlocalStorage.getItem(userId)=', window.localStorage.getItem('userId'), '\nthis.isAuthenticated=', this.isAuthenticated, '\nthis.session=', this.session);
		if(this._pendingAuthentication_mail){
this.dbgS.log('_handlerAuthenticationSucceeded A');
			try {
				this.loadCurrentUserByEmail(this._pendingAuthentication_mail);
				this._computeAdminRights();
			} catch( error ) {
this.dbgS.error('_handlerAuthenticationSucceeded error', error);
				this._handlerAuthenticationFailure(error);
			}
		}else{
/*
this.dbgS.log('_handlerAuthenticationSucceeded B :', window.localStorage.getItem('userId'));
			try {
				this._loadCurrentUserById_pending = false;
				this.loadCurrentUserById(window.localStorage.getItem('userId'));
				this._computeAdminRights();
			} catch( error ) {
this.dbgS.error('_handlerAuthenticationSucceeded error', error);
				this._handlerAuthenticationFailure(error);
			}
*/
		}
this.dbgS.error('_handlerAuthenticationSucceeded END', arguments);
// alert("authenticationSucceeded END");
	};

	_handlerInvalidationSucceeded(){
		cancel(this._waitForAuth_tout);
 		this.dbgS.log('_handlerInvalidationSucceeded', arguments);
		window.localStorage.removeItem('userId');
		this.set('currentUser', undefined);
		this.set('_intern_currentUser', undefined);
		try{
// 			this.invalidateCurrentUser();
			this._authEnded();
		}catch(error){
			this._handlerInvalidationFailure(error);
		}
		//this._computeAdminRights(); -- already called in _authEnded()
	};

	/* Addons not Ember-simple-auth :*/
	_handlerAuthenticationFailure(error){
		this._authEnded(null,error);
	};

	_handlerInvalidationFailure(error){
		this._authEnded(null,error);
	};

	_authEnded(user, failureError){//common code to be called for all internal methods after the OAuth process succeeds or fails : call the callbacks and reset the props.
		this.dbgS.error("_authEnded(", arguments,") this.session.isAuthenticated=" + this.session.isAuthenticated);
		cancel(this._waitForAuth_tout);
		if( failureError || !this.session.isAuthenticated ){
			this.dbgS.error("_authEnded with failureError {"+(failureError ? typeof failureError : "undefined" )+"}=", failureError);
			let error;
			if( failureError && typeof failureError === 'object' )
				error = failureError;
			else
				error = new Error();
			if( !error.responseJSON )
				error.responseJSON = {};
			if( failureError && !error.responseJSON.error_description )
				error.responseJSON.error_description = failureError.toString();
			while( this._authFailureCallbacks.length ){
				let cb = this._authFailureCallbacks.shift();
				cb(error);
			}
			/**/
			const	cbackAuthEnded = this._authEnded.bind(this),
					idx = this._userResolvedCallbacks.indexOf(cbackAuthEnded);
			if( idx >= 0 )
				delete( this._userResolvedCallbacks[idx] );
			while( this._userResolvedCallbacks.length ){
				let cb = this._userResolvedCallbacks.shift();
				try{
					cb( null );
				}catch(e){
					this.dbgS.error( "getCurrentUser() cback error :", e );
					throw e;
				}
			}
			this._userResolvedCallbacks = [];
//  			this._computeAdminRights();
		}else{
			this.currentUser = this._intern_currentUser;
			const	cbackAuthEnded = this._authEnded.bind(this),
					idx = this._authSuccessCallbacks.indexOf(cbackAuthEnded);
			if( idx >= 0 )
				delete( this._authSuccessCallbacks[idx] );
 			while( this._authSuccessCallbacks.length ){
 				let cb = this._authSuccessCallbacks.shift();
				cb( this._intern_currentUser );
 			}
		}
		this._userResolvedCallbacks = [];
		this._authSuccessCallbacks = [];
		this._authFailureCallbacks = [];
		this._loadCurrentUserById_pending = false;
		this._loadCurrentUserByEmail_pending = false;
		this.pendingAuthentication = false;
		this._pendingAuthentication_mail = null;
		this._computeAdminRights();
// alert("_authEnded(failureError) END");
		this.dbgS.log('_authEnded(', failureError, ') - END');
	};
	/*:: Ember-simple-auth events handlers*/

	_loadCurrentUserById_pending = false;
	async loadCurrentUserById(userId) {
		if( !userId || userId === null  || userId === "null" )//it happens when multiple tabs are opened in the other tabs than the actual used for loggin in
			return;
		if( this._loadCurrentUserById_pending ){
this.dbgS.error('loadCurrentUserById(', userId, ') - previous one pending ('+this._loadCurrentUserById_pending+') : ABORT 1');
			return;
		}
		this._loadCurrentUserById_pending = userId;
		if( this._intern_currentUser && this._intern_currentUser.get('id') == userId ){
this.dbgS.error('loadCurrentUserById('+userId+') - ABORT 2');
			this.currentUser = this._intern_currentUser;
			this._userResolved();
			return;
		}
this.dbgS.log('loadCurrentUserById(',userId,') - typeof:' + typeof userId);
		//const token = this.session.data.authenticated.access_token;
// 		this._intern_currentUser = await this.store.findRecord('user', userId).
// 		this._intern_currentUser =
		let user = await this.store.findRecord('user', userId).
		/*await this.store.queryRecord('user', {
				'filters[id]': userId,
				'token': token
			}).*/
		/*then(
			(user) => {
this.dbgS.log('loadCurrentUserById RESOLVED - user.id='+user.id, user);
				window.localStorage.setItem('userId', user.id);
				this.set('_intern_currentUser', user);
				this.currentUser = this._intern_currentUser;
				await this._userResolved();
				this._loadCurrentUserById_pending = false;
			}
		).*/catch(()=> {
this.dbgS.log('loadCurrentUserById ERROR - this.invalidateCurrentUser();');
			this.invalidateCurrentUser();
		});

		this.dbgS.log('loadCurrentUserById RESOLVED - user.id='+user.id, user);
		window.localStorage.setItem('userId', user.id);
		this.set('_intern_currentUser', user);
		this.currentUser = this._intern_currentUser;
		await this._userResolved();
		this._loadCurrentUserById_pending = false;
this.dbgS.log('loadCurrentUserById - func end :', this._intern_currentUser);


	};

 	_loadCurrentUserByEmail_pending = false;

	async loadCurrentUserByEmail(email) {
// 		if( this._loadCurrentUserByEmail_pending )
// 			return;
		if(!email)//it happens when multiple tabs are opened in the other tabs than the actual used for loggin in
			return;
		if( this._loadCurrentUserByEmail_pending ){
this.dbgS.log('loadCurrentUserByEmail - ABORT 1');
			return;
		}
		this._loadCurrentUserByEmail_pending = true;

this.dbgS.log('loadCurrentUserByEmail('+email+')');
// 		this._loadCurrentUserByEmail_pending = true;
		try {
			const token = this.session.data.authenticated.access_token;
			/*this._intern_currentUser = await this.store.queryRecord('user', {
				'filters[email]': email
			}).*/
			await this.store.queryRecord('user', {
				'filters[email]': email,
				'login': 1,
				'token': token
			}).then(
				(user) => {
this.dbgS.log('loadCurrentUserByEmail RESOLVED - user.id='+user.id, user);
					window.localStorage.setItem('userId', user.id);
					this.set('_intern_currentUser', user);
					this.set('currentUser', user);
 					this._userResolved();
					this._loadCurrentUserByEmail_pending = false;
				}
			).catch ( error => {
this.dbgS.error("loadCurrentUserByEmail failed to get the user's informations");
				this.invalidateCurrentUser();
				this._loadCurrentUserByEmail_pending = false;
				throw error;
			});
		} catch (error){
this.dbgS.error("loadCurrentUserByEmail failed to get the user's informations");
			this.invalidateCurrentUser();
			this._loadCurrentUserByEmail_pending = false;
			throw error;
		}
this.dbgS.log('loadCurrentUserByEmail('+email+') - END isAuthenticated=' + this.isAuthenticated);
	};

	isOlderUser() {
		const today = moment(new Date());
		const dateRegister = moment(this._intern_currentUser.dateRegister);
		return today.diff(dateRegister, 'days') > 2;
	};

	/**
	 * _userResolved() loads the user's rights separatly : can be considered as DEPRECATED for now as we load the rights for the current user directly through the user's model
	 */
	async _userResolved(){//async to avoid catching external errors in callbacks in our try blocks
		/**/
		await this._rightsResolved();
		return;
		/**/
this.dbgS.log("_userResolved - user-right : ", this.store.peekAll('user-right') );

		const _user = this._intern_currentUser;
		try {
			const token = this.session.data.authenticated.access_token;
			/*await this.store.queryRecord('user-rights', {
				'filters[userId]': _user.id
			})*/
			await this.store.queryRecord('user-right', {
				'filters[uid]': _user.id,
				'token': token
			}).then(
				(rights) => {
this.dbgS.log('_userResolved user-rights RESOLVED - rights=', rights);
// 					window.localStorage.setItem('userId', _user.id);
 					this._rightsResolved();
				}
			).catch ( error => {
this.dbgS.error("_userResolved failed to get the user's informations");
				this.invalidateCurrentUser();
				throw error;
			});
		} catch (error){
this.dbgS.error("_userResolved failed to get the user's informations");
			this.invalidateCurrentUser();
			throw error;
		}
	};

	_rights_handled = [];

	async _rightsResolved(){//async to avoid catching external errors in callbacks in our try blocks
		if( !this._intern_currentUser )
			return false;
		const	_user = this._intern_currentUser,
				_this = this;

// 		if(!_user.emailConfirmed)
// 			this.userService.showActivationBanner=true;

		if( _user.userRightsDats ){
			Object.entries( _user.userRightsDats ).forEach( ([label, item]) => {
				const _label = label;
				if( !Object.keys(item).length ){
					this.dbgS.log('user service DEFINING _this.'+label+'It()');
					if(this._rights_handled.indexOf(label)<0)
						this._rights_handled.push(label);
					eval( '_this.'+label+'It = function(){'+
							' if( this.currentUser && this.currentUser.userRightsDats && _this.currentUser.userRightsDats["'+label+'"] )'+
							'	return true;'+
							' return false;'+
							'};' );
					if( !_this.hasOwnProperty(label) ){//the method is now set : create  a direct get access for userService.label property
						Object.defineProperty(_this, label, {get: function(){
						this.dbgS.log("{A}_this."+_label+" callée");
							if( _user && _user.userRightsDats[_label] )
								return true;
							return false;
							}}
						);
					}
				}else{
	// 			Object.entries( item ).forEach( ([prop, value]) => {
		// 				this.prototype[item.label] = function( modelId ){
		// 					alert("modelId");
		// 				};
					if(this._rights_handled.indexOf(label)<0)
						this._rights_handled.push(label);
	this.dbgS.log('user service DEFINING _this.'+label+'It(model)');
					eval( '_this.'+label+'It = function( model ){'+
							'	_this.dbgS.log( "userService.'+label+'It(", model, "); => model.modelName:"+model.modelName+"\\nmodel.constructor.modelName:"+model.constructor.modelName+"\\nmodel.type:"+model.type+"\\nmodel.id:"+model.id+"\\nmodel=", model, "\\nthis.currentUser.userRightsDats['+label+']:", this.currentUser.userRightsDats["'+label+'"], "\\nthis.currentUser.userRightsDats['+label+'][model.constructor.modelName{"+model.constructor.modelName+"}]:", this.currentUser.userRightsDats["'+label+'"][model.constructor.modelName] );'+

							' if( this.currentUser && this.currentUser.userRightsDats &&  this.currentUser.userRightsDats["'+label+'"] && this.currentUser.userRightsDats["'+label+'"][model.constructor.modelName] && this.currentUser.userRightsDats["'+label+'"][model.constructor.modelName] == model.id ){'+
							'	_this.dbgS.log("return true!");'+
							'	return true;'+
							' }'+
							' _this.dbgS.log("return false!");'+
							' return false'+
							'};' );
					if( !_this.hasOwnProperty(label) ){//the method is now set : create  a direct get access for userService.label property
						Object.defineProperty(_this, label, {get: function(/*test = _label*/){
						this.dbgS.log("{B}_this."+_label+"(", /*test, */") callée");
							//return _this.??? What entity ?? this.currentCommunity etc

							return false;
						}});
					}
	// 			});
				}
			});
		}
		while( this._userResolvedCallbacks.length ){
			let cb = this._userResolvedCallbacks.shift();
			cb( _user );
		}
		this._userResolvedCallbacks = [];
		await this._computeAdminRights();
	}

	/* Common admins rights and status - January 2021
	 *
	 * We have 2 admins main levels : global admins (Civocracy employees only) and community admins
	 *
	 * The global admins has every rights on every communities.
	 * Community admins has more or less the same rights but only on one specific community and still all the specific rights may be settable : this service is listing methods to retrieve specific edit/manage rights. Some of them are really settable through the backoffice for an user, some of them are just universal and the service is just ensuring the user has an admin status to give this rights.
	 *
	 * ==> most of the time in components you will NOT USE isAdmin() to test an allowance to an admin feature but the specific method you'll have to implement if it doesn't exist !
	 * ==> Example of a specific method needed for idea box :
	 * 		<code>
	 * 		canModerateIdeaBox(){
	 * 			return this.isAdmin() && ;
	 * 		}
	 * 		</code>
	 *
	 *
	 * We also have a specific right : translator for all languages and translator for specific languages.
	 * The translator right apply on all communities as the editing tools impact the whole platform wording (no custom wording for specific communities at the moment).
	 *
	 */

//TODO: Move frontend methods at the start of the file

// 	@computed('_intern_currentUser', 'currentUser', 'currentCommunity')
// 	get

 	async _computeAdminRights(){// computed/tracked property using the actual community model if loaded
// this.dbgS.log("_computeAdminRights :: this.currentUser", this.currentUser);
		let foo = this.isDeveloper;//force computing
		if(!this._intern_currentUser){
if( this.hasCommunityOwnerRights || this.hasProjectAdminRights )
	this.dbgS.log("_computeAdminRights :: A hasCommunityOwnerRights=hasProjectAdminRights=false\nthis.currentUser=", this.currentUser);
			this.hasCommunityOwnerRights = false;
			this.hasProjectAdminRights = false;
			this.trigger('userRightsChanged');
		}else if( this._intern_currentUser.isGlobalAdmin ){
if( !this.hasCommunityOwnerRights || !this.hasProjectAdminRights )
	this.dbgS.log("_computeAdminRights :: B hasCommunityOwnerRights=hasProjectAdminRights=true\nthis.currentUser=", this.currentUser);
			this.hasCommunityOwnerRights = true;
			this.hasProjectAdminRights = true;
			this.trigger('userRightsChanged');
		}else{
			const community = this.currentCommunity,
				  project = this.currentProject,
				  _this = this;
			if(!community){
if( this.hasCommunityOwnerRights || this.hasProjectAdminRights )
	this.dbgS.log("_computeAdminRights :: C hasCommunityOwnerRights=hasProjectAdminRights=false\nthis.currentUser=", this.currentUser);
				this.hasCommunityOwnerRights = false;
				this.hasProjectAdminRights = false;
			}else{
// this.dbgS.log("_computeAdminRights :: D await hasAdminRightsForCommunity(", community,")");
					let a = this.hasCommunityOwnerRights;
					await this.loadUserCommunityFollowings();
					this.hasCommunityOwnerRights = this.hasAdminRightsForCommunity(community);

if( a != this.hasCommunityOwnerRights )
	this.dbgS.log("_computeAdminRights :: D hasCommunityOwnerRights="+this.hasCommunityOwnerRights+"\nthis.currentUser=", this.currentUser);

			}
			if(!project){
if( this.hasProjectAdminRights )
	this.dbgS.log("_computeAdminRights :: E hasProjectAdminRights=false\nthis.currentUser=", this.currentUser);
				this.hasProjectAdminRights = false;
			}else{
				let b = this.hasCommunityOwnerRights;
				this.hasProjectAdminRights = this.hasAdminRightsForProject(project);
if( b != this.hasProjectAdminRights )
	this.dbgS.log("_computeAdminRights :: D hasProjectAdminRights="+this.hasProjectAdminRights+"\nthis.currentUser=", this.currentUser);
			}
			if( community !== undefined || project !== undefined ){
				//If they are not defined it's then too early to trigger the event, let's wait for the parents routes to load
				this.trigger('userRightsChanged');
			}
		}
// this.dbgS.log("_computeAdminRights hasCommunityOwnerRights=", this.hasCommunityOwnerRights, "\nhasProjectAdminRights=", this.hasProjectAdminRights);
		/**/
	};

	hasAdminRightsForCommunity(communityOrId){
// this.dbgS.log("hasAdminRightsForCommunity(", communityOrId,") init on hasCommunityOwnerRights:", this.hasCommunityOwnerRights);
		let ret = false;
		if( !this._intern_currentUser || !this.currentUser ){
// this.dbgS.error("hasAdminRightsForCommunity :: A false");
			ret = false;
		}else if( this._intern_currentUser.isGlobalAdmin ){
// this.dbgS.error("hasAdminRightsForCommunity :: B true");
			ret = true;
		}else{
			const	followings = this.store.peekAll('community-following'),
					communityId = communityOrId.id ? communityOrId.id : communityOrId,
					filtered = followings.filter((cf) => {
				return cf.isCommunityAdmin && cf.get("user.id") == this._intern_currentUser.get("id") && cf.get("community.id") == communityId;
			});
			ret = (filtered.length > 0);
// this.dbgS.error("hasAdminRightsForCommunity :: C " + filtered.length);
		}
// this.dbgS.log("hasAdminRightsForCommunity(", communityOrId,") return ", ret);
		return ret ;
	}

	isAdminForProject(project){
		if (this.hasAdminRightsForCommunity(project.get('community.id'))) {
			return true;
		}
		return this.hasAdminRightsForProject(project.id);
	}

	hasAdminRightsForProject(projectOrId){
// this.dbgS.log("hasAdminRightsForProject(", projectOrId,"{"+ typeof projectOrId +"}) init on hasCommunityOwnerRights:", this.hasCommunityOwnerRights, "\nhasProjectAdminRights:", this.hasProjectAdminRights);
		if( !projectOrId || ( typeof projectOrId === "object" && (!projectOrId.get || !projectOrId.id) ) ){
// this.dbgS.log("hasAdminRightsForProject(", projectOrId,") return false A");
			return false;
		}
		if( !this._intern_currentUser || !this.currentUser ){
// this.dbgS.log("hasAdminRightsForProject(", projectOrId,") return false B");
			return false;
		}
		//if user is a community admin he is also a project admin!
		/* UPDT : No! he is not as he can follow some projects voluntarily and don't follow other
		 => in components we need to test userService.hasCommunityOwnerRights AND userService.hasProjectAdminRights if we want to check the rights to edit something but the two of them are not dependant to implement the needed behavior
		if (this.hasAdminRightsForCommunity(projectOrId.get('community.id'))) {
			return true;
		}
		*/
		const 	followings = this.store.peekAll('project-following'),
				pid = projectOrId.id ? projectOrId.id : projectOrId,
				filtered = followings.filter((pf) => {
			return pf.isProjectAdmin && pf.get("user.id") == this._intern_currentUser.get("id") && pf.get("project.id") == pid;
		});
// this.dbgS.log("hasAdminRightsForProject: followings=", followings);
// this.dbgS.log("hasAdminRightsForProject("+ pid +"): return ", (filtered.length>0));

		return filtered.length>0;
	}

	/**
	 * Does the user have access to project if it is private?
	 * @param project
	 * @returns {boolean}
	 */
	async hasAccessToProject(project){
		if (!project.private) {
			// public project, doesn't matter
			return true;
		}

		if( !this._intern_currentUser || !this.currentUser ){
			// not logged in, no access
			return false;
		}

		/*
		//if user is community admin he is also a project admin!
		if (this.hasAdminRightsForCommunity(project.get("community.id"))) {
			this.dbgS.error('hasAccessToProject return true');
			return true;
		}
		*/

		// make sure we've loaded project-following
		await this.loadProjectFollowingsAndProjects();

		// if user is a follower (if he previously used the project password), then he has access
		const followings = this.store.peekAll('project-following');
		const filtered = followings.filter((pf) => {
			return pf.get("user.id") == this._intern_currentUser.get("id") && pf.get("project.id") == project.id;
		});
		return filtered.length>0;
	}

	@computed('_intern_currentUser', 'currentUser')
	get isGlobalAdmin(){
		if( !this._intern_currentUser || !this.currentUser ){
			return false;
		}
		return this._intern_currentUser.isGlobalAdmin;
	};

	@computed('_intern_currentUser', 'currentUser')
	get isDeveloper(){
		if( !this._intern_currentUser || !this.currentUser ){
			return false;
		}
		return this._intern_currentUser.isDeveloper;
	};

	@computed('_intern_currentUser', 'currentUser')
	get isWebmaster(){
		if( !this._intern_currentUser || !this.currentUser ){
			return false;
		}
		return this._intern_currentUser.isWebmaster;
	};

	@computed('_intern_currentUser', 'currentUser')
	get isTranslator(){
		return ( this.isTranslatorDE || this.isTranslatorEN || this.isTranslatorES || this.isTranslatorFR || this.isTranslatorHR || this.isTranslatorNL );
	};

	/*Get translator status by locale ::*/
	@computed('_intern_currentUser', 'currentUser')
	get isTranslatorDE(){
		if( !this._intern_currentUser || !this.currentUser ){
			return false;
		}
		return this._intern_currentUser.isTranslatorDE;
	};

	@computed('_intern_currentUser', 'currentUser')
	get isTranslatorEN(){
		if( !this._intern_currentUser || !this.currentUser ){
			return false;
		}
		return this._intern_currentUser.isTranslatorEN;
	};

	@computed('_intern_currentUser', 'currentUser')
	get isTranslatorES(){
		if( !this._intern_currentUser || !this.currentUser ){
			return false;
		}
		return this._intern_currentUser.isTranslatorES;
	};

	@computed('_intern_currentUser', 'currentUser')
	get isTranslatorFR(){
		if( !this._intern_currentUser || !this.currentUser ){
			return false;
		}
		return this._intern_currentUser.isTranslatorFR;
	};

	@computed('_intern_currentUser', 'currentUser')
	get isTranslatorHR(){
		if( !this._intern_currentUser || !this.currentUser ){
			return false;
		}
		return this._intern_currentUser.isTranslatorHR;
	};

	@computed('_intern_currentUser', 'currentUser')
	get isTranslatorNL(){
		if( !this._intern_currentUser || !this.currentUser ){
			return false;
		}
		return this._intern_currentUser.isTranslatorNL;
	};

	/*::Get translator status by locale*/

	hasTranslatorRights( language ){
		if( !this._intern_currentUser )return false;
		if( !language ){
this.dbgS.log("hasTranslatorRights("+language+") : " + this._intern_currentUser.isGlobalAdmin);
			return (this.isTranslatorDE || this.isTranslatorEN || this.isTranslatorES || this.isTranslatorFR || this.isTranslatorHR || this.isTranslatorNL);
		}
this.dbgS.log("hasTranslatorRights("+language+") : " + ( language ? this._intern_currentUser[language.toUpperCase()] : "" ));
		return this._intern_currentUser[language.toUpperCase()];
	};
	/* Common admins rights */

	/* Community admins and rights*/

	/**/
	/* Global-admins and rights*/

	/**/

	/**
	 * unknownProperty()
	 *
	 * This is used by any caller to retrieve a right from the user.
	 * The unknownProperty() is a basic Ember handler that we use to compute a particular right for the user without having to implement the UserService for each right.
	 * See : https://api.emberjs.com/ember/release/functions/@ember%2Fobject/get
	 * To use in a route, controller or component, the code would be :
	 * <code>alert( "user.canTest ? => " + get( this.userService , "canTest") );</code>
	 * if this.currentUser.userRights.canTest is true the return value will be true.
	 *
	 * Note that, as it is a property, it always refer to the current context.
	 *
	 */
	unknownProperty( rightLabel ){
this.dbgS.log("userService.unknownProperty(", arguments,");\nthis=", this);

		// For non allowed rights, either by accessing by property (eg: this.userService.canTest) or by method (this.userService.canTestIt(aCommunity)) the following condition will return false. If the right is defined only the access by property will use the unknownProperty handler, the access by method will use a automaticaly defined method
		if( !this._intern_currentUser || !this._intern_currentUser.userRightsDats )
			return false;
// this.dbgS.log("userService.unknownProperty(", arguments,");\ncurrentUser=", this._intern_currentUser, "\n_intern_currentUser.userRightsDats=", this._intern_currentUser.userRightsDats);
		let ret = false;
		Object.entries( this._intern_currentUser.userRightsDats ).forEach( ([label, item]) => {
			if( rightLabel === label ){
				//
				if( !Object.keys(item).length ){
					ret = true;
					return true;
				}
				Object.entries(item).forEach( ([modelName, value]) => {
					// Here we specificaly check the context :
					// For now we are only supporting communityService.currentCommunity but other cases will need to be implemented (issue, comments etc)
					if( modelName === "community" ){
						if( value && this.currentCommunity && value === this.currentCommunity.id ){
							// We may allow here for cases where a modelName is given by the backend with a null value. That would allow any id given the modelName (meaning that for the right "canTest" referencing a null id for community the right would be true whenever this.currentCommunity is not null, regardless of it's actual id)
							// => For now we don't handle this case as it may be confusing...
							ret = true;
							return true;
						}
					}
				});
				//same for "proposition", "issue", "comment" etc.
			}
		});

		return ret;
	};

/*
BE implementation:
Challenges :
 1) avoir un nombre de droits potentiellement infini, dont certains globaux et d''autres liés à une communauté précise ou encore à un module précis (par exemple PB mais il y en aura d''autres)
		- entité Right linkée à un utilisateur, avec une valeur boolean + linkée optionnelement à tout autre entité => soit une colonne par entité, mais bof, soit plutôt une colonne `entity_relation` qui peut contenir n''importe quel type d''entité (==> champ string avec type de l''entité + son id)
		- comment récupérer ça dans Ember ?

 2) ne pas faciliter le hacking en listant facilement ces droits...
		- pas simple mais du coup ça pourrait être d''utiliser le load à la demande de Ember avec uniquement une computed renvoyée par le BE : hasAdminRights / hasTranslatorRights / isGlobalAdmin ? pour charger la liste des droits...
		- autre solution plus simple : le BE ne renvoie que le strict nécessaire : la computed hasAdminRights / hasTranslatorRights / isGlobalAdmin + les droits qui sont true et cache tous les autres droits
			==> seule une requête admin permet de connaitre une partie des droits possible (seuls ceux qui sont true pour cet admin donc)
		(de toute manière tout système fera transiter les infos donc tout man-in-the-middle créé une faille mais le backend vérifiera les droits avant d''appliquer les actions protégées)

 3) avoir un système que les devs peuvent implémenter sans trop de complication
		- une simple requête permettra de créer de nouveaux droits ?
		en gros userService.recRight('canDoSomething', model|null, "same" | "allChilds" | "allPropositions" etc) sera utilisée par le backend pour créer des droits sans avoir besoin d''un user particulier
			=> il nous faudra un log détaillé de ces requetes mais à part ça ça ne devrait pas poser de problème de sécurité puisque créer un nouveau droit ne permettra rien de nouveau
			=> on aura aussi un paramètre de controle de propagation : certains droits seront applicables uniquement à l''entité en cours (model), d''autres à toutes ses sub-entities etc

 4) pour ajouter des droits aux utilisateurs ?
		- interface backoffice pratique sur le BE
		- pour le FE : droit genre "canAdministrateRights" (si true ce sera possible uniquement sur un set particulier d''entités - en gros un admin de level "owner" ne peut pas ajouter des droits sur une autre communauté par contre il peut sur des sous-entités de cette communauté)

==> Ok
==>
a) entité `UserRight` en manyToMany sur l''entité `User` + pas de value boolean ! si l''entité de label 'canDoSomething' existe pour cet utilisateur et ce contexte le droit est true, sinon il est false

b) pour les utilisateurs qui ne sont pas "self" le BE renvoie 3 propriétés boolean : isAdmin, isTranslator, isGlobalAdmin

c) les nouveaux droits implémentés seront créables via des outils type FE backoffice au moment du set en callant genre "grantCanDoSomething( model )"


d) pour la question traduction : set de méthodes particulières :
grantTranslations( locale|null )
isTranslator(locale)
et c''est tout
du côté model/entity on aura

`canTranslateDe`
`canTranslateEn`
`canTranslateEs`
`canTranslateFr`
`canTranslateHr`
`canTranslateNl`


e) pour tout ce qui est "ownership" comme Comment ou autre, il nous faut aussi une logique particulière : frontend only ou backend ?
`canComment` peut être computé par le FE lui-même et ça évite de peupler la database, voir de devoir modifier ces droits si l''owner change (peu probable mais pourrait arriver pour une raison ou une autre)
+ avoir un right BE obligera aussi à discréminer les droits considérés comme faisant de l''user un admin ou non ce qui compliquera l''ensemble des logiques FE, BE et implémentation de nouveaux droits.
*/


    /*Get communities / projects >>>>*/
	async getUserCommunities() {
		if( !this.getCurrentUser() || !this.isAuthenticated )
			return [];
		await this.loadUserCommunityFollowings();
		const	userId = this.getCurrentUser().id,
				communityFollowings = this.store.peekAll('community-following').filter(communityFollowing=>{
					//now that we have all the followings from the store, we still need to filter out the one for the current user !
					if( communityFollowing.status == "active" && communityFollowing.get('user.id') == userId ){
// this.dbgS.log("ADDING communityFollowing{"+communityFollowing.get('id')+"/"+communityFollowing.get('status')+"/"+communityFollowing.get('community.id')+"/"+communityFollowing.get('community.url')+"/"+communityFollowing.get('user.id')+"<>"+userId+"}=", communityFollowing, "\n", communityFollowing.community);
						return true;
					}/*else{
// this.dbgS.log("SKIPPING communityFollowing{"+communityFollowing.get('id')+"/"+communityFollowing.get('status')+"/"+communityFollowing.get('community.id')+"/"+communityFollowing.get('community.url')+"/"+communityFollowing.get('user.id')+"<>"+userId+"}=", communityFollowing, "\n", communityFollowing.community);
					}*/
				});

		const promises = communityFollowings.map(async (communityFollowing) => await communityFollowing.community);

		let userCommunities = await RSVP.all(promises);
		if( !userCommunities.length )
			return [];
		userCommunities = userCommunities.filter( community => {//ensure we get active/private/admin communities only !
			if( community.status != "deleted" && community.status != "duplicate" && community.status != "unactivated" && community.status != "disabled" )
				return true;
		});
		if( !userCommunities.length )return [];
		return userCommunities;
	}

	async getUserProjects() {
		if( !this.getCurrentUser() || !this.isAuthenticated )
			return [];
		await this.loadProjectFollowingsAndProjects();
		const userId = this.getCurrentUser().id;
		const projectFollowings = this.store.peekAll('project-following').filter(projectFollowing => {
			//now that we have all the followings from the store, we still need to filter out the one for the current user !
			if (projectFollowing.status == "active" && projectFollowing.get('user.id') == userId)
				return true;
		});
		const promises = projectFollowings.map(async (projectFollowing) => await projectFollowing.project);

		let userProjects = await RSVP.all(promises);
		if( !userProjects.length )
			return [];
		userProjects = userProjects.filter( project => {//ensure we get active/private/admin communities only !
			if( project.status != "deleted" && project.status != "duplicate" && project.status != "unactivated" && project.status != "disabled" )
				return true;
		});
		if( !userProjects.length )return [];
		return userProjects;
	}

	/*Preload user's datas ::*/
	_loadUserProjects() {
/*
		if (this.getCurrentUser() && this.isAuthenticated) {
			this.loadProjectFollowingsAndProjects();
		} else this.getCurrentUser(this._loadUserProjectsCBack.bind(this));
*/
		this.getCurrentUser(this._loadUserProjectsCBack.bind(this));
	}

	_loadUserProjectsCBack() {
		this.loadProjectFollowingsAndProjects();
	}

	// here we needed to also load the Project (to eventually get the community url) in order to
	// successfully generate the links in the user menu.hbs
	// can be used directly to refresh the store

	_userProjects = [];//don't use directly ! use this.loadProjectFollowingsAndProjects()
	_userCommunities = [];//don't use directly ! use this.loadUserCommunityFollowings

	async loadProjectFollowingsAndProjects(forceRefresh) {
		if(forceRefresh)
			this._userProjects = [];
		if( !this._userProjects.length ){
			if(this._intern_currentUser){
				const projectFollowings = await this.store.query('project-following', {
					"filters[user]": this._intern_currentUser.id,
					"filters[status]": "active"
				});
// 				console.error("loadProjectFollowingAndProject() LOADED" + projectFollowings.length, projectFollowings);
				/*Now load projects*/
				const promises = projectFollowings.map(async (projectFollowing) => await projectFollowing.project);

				this._userProjects = await RSVP.all(promises);
				if( !this._userProjects.length ){
					this._userProjects = [];
				}else{
					this._userProjects = this._userProjects.filter( project => {//ensure we get active/private/admin communities only !
						if( project.status != "deleted" && project.status != "duplicate" && project.status != "unactivated" && project.status != "disabled" )
							return true;
					});
				}
			}
		}
		return this._userProjects;
	}

	_loadUserCommunities() {
		this.getCurrentUser( this._loadUserCommunitiesCBack.bind(this) );
	}

	_loadUserCommunitiesCBack() {
this.dbgS.log('_loadUserCommunitiesCBack user:', this.getCurrentUser());
/*
		if(this.getCurrentUser())
			this.store.queryRecord('community-following', { "filters[user]": this.getCurrentUser().id });
*/
		this.loadUserCommunityFollowings();
	}

	// can be used directly to refresh the store
	async loadUserCommunityFollowings(forceRefresh) {
this.dbgS.log('loadUserCommunityFollowings('+forceRefresh+')');
		if(forceRefresh)
			this._userCommunities = [];
		if( !this._userCommunities.length ){
			if(this._intern_currentUser){
this.dbgS.log('launching loadUserCommunityFollowings('+forceRefresh+')');
				const communityFollowings = await this.store.query('community-following', {
					"filters[user]": this._intern_currentUser.id
				});
// console.error("loadUserCommunityFollowings() LOADED" + communityFollowings.length, communityFollowings);

				const promises = communityFollowings.map(async (communityFollowing) => await communityFollowing.community);

				this._userCommunities = await RSVP.all(promises);
				if( !this._userCommunities.length ){
					this._userCommunities = [];
				}else{
					this._userCommunities = this._userCommunities.filter( community => {//ensure we get active/private/admin communities only !
						if( community.status != "deleted" && community.status != "duplicate" && community.status != "unactivated" && community.status != "disabled" )
							return true;
					});
				}

			}
		}
		return this._userCommunities;
	}


	/*:: Preload user's datas*/
    /*<<<< Get communities / projects*/

	_eventsHandlersCallbacks = [];
	on(eventName, callback){
		if(!this._eventsHandlersCallbacks[eventName]){
			this._eventsHandlersCallbacks[eventName] = [];
// 			this.dbgS.log('user service '+eventName+' created');
		}
		if(!this._eventsHandlersCallbacks[eventName].includes(callback)){
// 			this.dbgS.log('user service '+eventName+' adding ', callback);
			this._eventsHandlersCallbacks[eventName].push(callback);
		}
	}

	trigger(eventName){
		if(!this._eventsHandlersCallbacks[eventName])
			return;
// 		this.dbgS.log('user service trigger('+eventName+')');
		this._eventsHandlersCallbacks[eventName].forEach(cb => {
			try{
// 				this.dbgS.log('user service trigger('+eventName+') calling', cb);
				cb();
			}catch(e){this.dbgS.error( "user service trigger("+eventName+"): _eventsHandlersCallbacks cback error :", e );}
		});
	}

	showActivationEmailPopup() {
        if (window.innerWidth <= config.breakpoints.phone) {
            this.phone.showPhonePage('login-registration.phone.activation-mail-page', {}, 'login-registration.activation-mail');
        } else {
            this.popupService.showPopup('login-registration.activation-mail-popup', {}, undefined, 'login-registration.activation-mail');
        }
    }

}
