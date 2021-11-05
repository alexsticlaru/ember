import Controller from '@ember/controller';
import {inject as service} from '@ember/service';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';

export default class AccessProjectController extends Controller {
	@service user;
	@service store;
	@service popup;

	@tracked password;
	@tracked showErrorMessage = false;

	@action accessProject() {
		this.showErrorMessage = false;

		const projectFollowing = this.store.createRecord('project-following', {
			project: this.model,
			user: this.user.getCurrentUser(),
			password: this.password
		});

		projectFollowing.save().then(() => {
			this.transitionToRoute('community.participation', this.model.url);
		}).catch( () => {
			this.showErrorMessage = true;
		});
	}

}
