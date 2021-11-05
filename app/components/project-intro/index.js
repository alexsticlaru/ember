import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import config from '../../config/environment';

export default class ProjectIntroComponent extends Component {
	@service router;
	@service('user') userService;
	@service store;
	@service community;
	@service popup;
	@service share;
	@service intl;

	@tracked userFollowsProject = false;

	constructor() {
		super(...arguments);
		this.community.getUserProjects().then((projects) => {
      projects.forEach((project) => {
				if (project==this.args.model.project) {
					this.userFollowsProject = true;
				}
      });
    });
	}

	get config() {
		return config;
	}

	@action shareProject() {
		const shareModel = {
			url: window.location.href,
			popupTitle: this.intl.t('ideaBox.shareButton.projectShare'),
			shareMessage: this.intl.t('ideaBox.shareButton.messageProject')
		};

		this.share.showPopup(shareModel);
	}

	@action followProject() {
		if (this.userService.getCurrentUser()) {
			this.store.createRecord('project-following', {
					user: this.userService.getCurrentUser(),
					project: this.args.model.project,
			}).save().then(() => {
				this.userFollowsProject = true;
			});
		} else {
			this.popup.showPopup('login-registration.login-popup', {}, undefined, 'login-registration.login');
		}
	}

	@action async removeFollow(){
		let projectFollowing = null;
		const projectFollowings = this.store.peekAll('project-following');
		projectFollowings.forEach((following) => {
			if (following.project.get("id")==this.args.model.project.id) {
				projectFollowing = following;
			}
		});

		projectFollowing.destroyRecord().then(() => {
			this.userFollowsProject = false;
		});

	}

	get hasIdeaBox() {
		return this.args.model.project.participationPack.get('firstObject').type == "proposition";
	}

	@action participateAction() {
		const ideaBox = this.args.model.project.participationPack.get('firstObject');

		if (ideaBox.visibility == "public" && ideaBox.type == "proposition") {
			this.router.transitionTo('community.participation.proposition', this.args.model.community.url, this.args.model.project.url, ideaBox.id, ideaBox.url);
		}


		if (ideaBox.visibility == "confidential" && ideaBox.type == "proposition") {
			const ideaBoxModel = {
				participationPack: ideaBox,
				propositions: [],
				project: this.args.model.project,
				community: this.args.model.community,
				showConfidentialPopup: true,
			};

			if (this.userService.getCurrentUser()) {
				this.popup.showPopup("community.participation.proposition-confidential-popup", ideaBoxModel, undefined, 'community.participation.proposition-add');
			} else {
				this.popup.showPopup('login-registration.login-popup', {}, undefined, 'login-registration.login');
			}
		}
	}

}
