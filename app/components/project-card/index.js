import Component from '@glimmer/component';
import {action} from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";
import config from '../../config/environment';

export default class ProjectCard extends Component {
	@service user;
	@service popup;

	@tracked hasAccessToProject;

	constructor() {
		super(...arguments);

		this.hasAccessToProject = this.user.hasAccessToProject(this.args.project);
	}

	get config() {
		return config;
	}

	@action accessWithPassword() {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}
		this.popup.showPopup("project-password-popup", this.args.project);
	}
}
