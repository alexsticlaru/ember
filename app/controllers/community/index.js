import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import config from '../../config/environment';

export default class IndexCommunityController extends Controller {
	@service('user') userService;
	@service('community') communityService;
	@tracked projectsStatus = "active";

	constructor(){
		super(...arguments);
		//we fire a load of the user asap:
		this.userService.getCurrentUser();
	}

	get userIsDeveloper(){
		return this.userService.isDeveloper;
	}

	get config() {
		return config;
	}

	get projectsExist() {
		if (!this.model.projects) {
			return false;
		}
		return this.model.projects.any(entity => entity.status === this.projectsStatus);
	}

    @action
	changeProjects(status) {
        this.projectsStatus = status;
	}

	@action showActivationEmailPopup(){

		this.userService.showActivationEmailPopup();
		 }

}
