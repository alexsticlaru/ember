import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class UserMenu extends Component {
    @service intl;
    @service toast;
    @service community;
	@service('user') userService;
	@service('debug') dbgS;
	@tracked userCommunities = [];
	@tracked userProjects = [];

	constructor() {
		super(...arguments);
		this.community.getUserCommunities().then((communities) =>
			this.userCommunities = communities
		);

		this.community.getUserProjects().then((projects) =>
			this.userProjects = projects
		);
	}

	get userHasProjectsFollowing(){
// this.dbgS.log("userHasProjectsFollowing() :" + (this.userProjects.length>0) + "\nthis.userProjects=", this.userProjects);
		return this.userProjects.length > 0;
	}

	get userHasCommunitiesFollowing(){
// this.dbgS.log("userHasCommunitiesFollowing() :" + (this.userCommunities.length>0) + "\nthis.userCommunities=", this.userCommunities);
		return this.userCommunities.length > 0;
	}

    @action
	logout() {
		this.userService.logout();
		this.toast.info(
			this.intl.t('bubble.logout.confirm'),
			this.intl.t('bubble.logout.confirm.title')
		);
	}
}
