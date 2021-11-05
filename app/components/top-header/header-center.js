import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
// import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class HeaderCenter extends Component {
  @service('community') communityService;
  @service('user') userService;
  @service('debug') dbgS;
  @service router;

  @tracked userCommunity = false;
  @tracked userProjects = [];

  constructor() {
    super(...arguments);
	/** /
	No more "userCommunity"! : one admin/owner still can be on multiple communities and implementing a rule saying that a user can only be an owner in one community is a designer view, not a developer one !
	=> we use now this.communityService.currentCommunity
    this.communityService.getUserCommunities().then((communities) =>
		this.userCommunity = communities.get('firstObject')
	);
	*/

	//this.communityService.getUserProjects()
	this.communityService.on('communityProjectsLoaded', this._communityProjectsLoaded.bind(this));
	this.communityService.getCommunityProjects().then((projects) => {
		this.userProjects = projects;
	});
	// 	this.userProjects = this.communityService.getCommunityProjects();
	// 	console.error('communityProject constructor', this.userProjects);
	// 	this._communityProjectsLoaded();
  }

  _communityProjectsLoaded(){
	  this.communityService.getCommunityProjects().then((projects) => {
		  this.userProjects = projects;
	  });
  }

  get userIsNormalAdmin(){
    //here I check if a user has admin rights for any project
	if( this.userService.hasCommunityOwnerRights )
		return true;
    let adminProjects = [];
	if(this.userProjects.filter){
		adminProjects = this.userProjects.filter(item => {
			const is = this.userService.isAdminForProject(item);
// this.dbgS.error("userIsNormalAdmin - is=", is, item);
			if( is )
				return true;
		});
	}
    return adminProjects.length > 0;
  }

  get loggedUser() {
	return this.userService.getCurrentUser();
  }

  get showAdminsMenu(){
	  return this.router.currentURL && (this.router.currentURL.indexOf('how-it-works') > -1 || ( this.userIsNormalAdmin && this.router.currentURL.indexOf('settings') > -1 ));
  }

  get selectCommunity(){
	if(!this.router.currentURL)return "";
	let i = this.router.currentURL.indexOf('settings');
	if( i < 0 )
		return "";
	const	short = this.router.currentURL.substr(0, i),
			spl = short.split('/');
// this.dbgS.log('selectCommunity():short=', short, "\nspl {"+spl.length+"}=", spl);
	if(spl.length == 3)
			return "active-item ";
	return "";
  }

  get selectProjects(){
	if(!this.router.currentURL)return "";
	let i = this.router.currentURL.indexOf('settings');
	if( i < 0 )
		return "";
	const	short = this.router.currentURL.substr(0, i),
			spl = short.split('/');
// this.dbgS.log('selectProjects():short=', short, "\nspl {"+spl.length+"}=", spl);
	if(spl.length == 4)
			return "active-item ";
	return "";
  }

  get selectHowItWorks(){
	if(!this.router.currentURL)return "";
	if(this.router.currentURL.indexOf('how-it-works') > -1)
		return "active-item ";
	return "";
  }

}
