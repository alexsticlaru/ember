import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ProjectsMenu extends Component {
    @service('community') communityService;
    @tracked userProjects = [];
    @tracked communityProjects = [];

	constructor() {
		super(...arguments);
		this.communityService.on('communityProjectsChanged', this._communityProjectsChanged.bind(this));

		this.communityService.getCommunityProjects().then((projects) => {
			this.communityProjects = projects;
		});

	}

	_communityProjectsChanged(){
		this.communityService.getCommunityProjects().then((projects) => {
			this.communityProjects = projects;
		});
	}

	get communityHasProjects(){
		return this.communityProjects.length > 0;
	}

	get activeProjects(){
		return this.communityProjects.filter(item => item.status =="active");
	}

	get notActiveProjects(){
		return this.communityProjects.filter(item => item.status !=="active");
	}

}
