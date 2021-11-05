import Service, { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";
import RSVP from 'rsvp';

/**
 * @REPLACE the deprecated customer service
 *
 * This service is an helper that provides the current community and computes any needed data / status etc for the actual community
 * In some cases the community could be null ! as for the Civ homepage, the communities page, and more to be done)
 * but for this cases we should have specific routes and components not asking anything from the CommunityService
 *
 */
export default class CommunityService extends Service {
	@service store;
	@tracked currentCommunity;
	@tracked currentProject;
	@service('user') userService;
	@service('debug') dbgS;

	/* Main frontend methods ::*/
	get getCurrentCommunity() {
		return this.currentCommunity;
	};

	invalidateCurrentCommunity() {
this.dbgS.log('COMMUNITY SERVICE invalidateCurrentCommunity');
		localStorage.removeItem('communityId');
		this.currentCommunity = undefined;
		this._communityProjects = [];
		this.userService.setCurrentCommunity(this.currentCommunity);
	};

	async setCurrentCommunity(community) {
this.dbgS.log("COMMUNITY SERVICE setCurrentCommunity(", community, ");", trace());
		const change = ( this.currentCommunity && this.currentCommunity != community );
		this.currentCommunity = community;
		if(this.currentCommunity)
			await this._loadCommunityProjects(change);
		this.userService.setCurrentCommunity(this.currentCommunity);
	}

	async setCurrentProject(project) {
this.dbgS.log('COMMUNITY SERVICE setCurrentProject(', project, ");");
		this.currentProject = project;
		if(project && !this.currentCommunity)
			await this.setCurrentCommunity(project.community);
		this.userService.setCurrentProject(this.currentProject);
	}

	/*:: Main frontend methods */

	constructor() {
		super(...arguments);
this.dbgS.log('COMMUNITY SERVICE service community::constructor');
		if (localStorage.getItem('communityId')) {
			this.loadCurrentCommunityById(localStorage.getItem('communityId'));
this.dbgS.log('COMMUNITY SERVICE CommunityService::currentCommunity = ', this.currentCommunity);
		}
// 		this.loadUserCommunities();
		// this.loadUserProjects();
// 		 this.loadUserProjectFollowings();
	}

	async loadCurrentCommunityById(communityId) {
		const change = ( this.currentCommunity && this.currentCommunity.id != communityId );
		this.store.findRecord('community', communityId).then(
			(community) => {
				this.currentCommunity = community;
				this._loadCommunityProjects(change);
			}
		).catch(()=> {
this.dbgS.log('COMMUNITY SERVICE loadCurrentCommunityById('+communityId+') - failed!!', this.currentCommunity);
			// why invalidating the user's session ?? this.session.invalidate();
			this.invalidateCurrentCommunity();
		});
	};

	getCommunityById(communityId) {
		return this.loadCurrentCommunityById(communityId)
	};

	async loadCurrentCommunity(communitySlug) {
		const change = ( this.currentCommunity && this.currentCommunity.url != communitySlug );
this.dbgS.log('COMMUNITY SERVICE loadCurrentCommunity !!', communitySlug);
		try {
			this.currentCommunity = await this.store.queryRecord('community', {
				"filters[url]": communitySlug
			})
			localStorage.setItem('communityId', this.currentCommunity.id);
			this._loadCommunityProjects(change);
			return this.currentCommunity;
		} catch (err){
			// what to do ? redirect on 404 page ?
			this.dbgS.error("loadCurrentCommunity("+communitySlug+") failed : ", err);
			this.invalidateCurrentCommunity();
		}
	};

	async createNewCommunity(newCommunity) {
		this.invalidateCurrentCommunity();
this.dbgS.log('COMMUNITY SERVICE createNewCommunity(', newCommunity, ')');
		const community = this.store.createRecord('community', newCommunity);
		return this.currentCommunity = await community.save();
	}

	_loadUserCommunities() {
		return this.userService._loadUserCommunities();
	}

	_loadUserProjects() {
		return this.userService._loadUserProjects();
	}

	/*Preload community's projects ::*/
	_loadCommunityProjects(forceRefresh) {
		this.loadCommunityProjects(forceRefresh);
	}

	_communityProjects = [];//don't use directly ! use getCommunityProjects()

	async loadCommunityProjects(forceRefresh) {
console.log('loadCommunityProjects(', forceRefresh, ');');
		if(forceRefresh)
			this._communityProjects = [];

		if( !this._communityProjects.length ){
			if(this.currentCommunity && (this.currentCommunity.get('id') || this.currentCommunity.id )){
console.log('query project this=', this, '\nthis.currentCommunity=', this.currentCommunity
	, '\nthis.currentCommunity.get(id)=', this.currentCommunity.get('id')
);
				const projects = await this.store.query('project', {
					"filters[community]": this.currentCommunity.id,
					//"filters[status]": "active"
				});
				if( !projects.length ){
					this._communityProjects = [];
				}else{
					/*
					this._communityProjects = this._communityProjects.filter( project => {//ensure we get active/private/admin communities only !
						if( project.status != "deleted" && project.status != "duplicate" && project.status != "unactivated" && project.status != "disabled" )
							return true;
					});
					*/
					this._communityProjects = projects;
				}
			}
			this.trigger('communityProjectsChanged');
		}
		return this._communityProjects;
	}

	async getCommunityProjects(forceQuery){
		if( !this.currentCommunity )
			return [];
 		await this.loadCommunityProjects(forceQuery);
		const loadedProjects = this.store.peekAll('project');
		if( loadedProjects.length ){//loading from cache if possible
			const communityLoadedProjects = loadedProjects.filter(item => item.community.get('id') == this.currentCommunity.get('id'));
			if( communityLoadedProjects.length )
				return communityLoadedProjects;
		}
		return [];
	}

	async getUserCommunities() {
		return await this.userService.getUserCommunities();
	}

	async getUserProjects() {
		return await this.userService.getUserProjects();
	}

	/**/
	_eventsHandlersCallbacks = [];
	on(eventName, callback){
		if(!this._eventsHandlersCallbacks[eventName]){
			this._eventsHandlersCallbacks[eventName] = [];
			 			this.dbgS.log('community service '+eventName+' created');
		}
		if(!this._eventsHandlersCallbacks[eventName].includes(callback)){
			this.dbgS.log('community service '+eventName+' adding ', callback);
			this._eventsHandlersCallbacks[eventName].push(callback);
		}
	}

	trigger(eventName){
		if(!this._eventsHandlersCallbacks[eventName])
			return;
		this.dbgS.log('community service trigger('+eventName+')');
		this._eventsHandlersCallbacks[eventName].forEach(cb => {
			try{
				this.dbgS.log('community service trigger('+eventName+') calling', cb);
				cb();
			}catch(e){this.dbgS.error( "community service trigger("+eventName+"): _eventsHandlersCallbacks cback error :", e );}
		});
	}
}
