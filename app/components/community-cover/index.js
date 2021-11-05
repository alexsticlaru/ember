import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
// import { tracked } from '@glimmer/tracking';
// import { computed } from '@ember/object';
import config from '../../config/environment';

export default class CommunityCoverComponent extends Component {
	@service intl;
	@service share;

	@service('user') userService;

    get config() {
        return config;
    }
	// Community Members Count is the sum of all members/followers of its projects
	get membersCount() {
		let sum = 0;
		this.args.model.projects.forEach((project) => {
			if (project.globalRelevancy) {
				sum += project.globalRelevancy;
			}
		})
		return sum;
	}

	constructor() {
		super(...arguments);
		this.userService.getCurrentUser();
	}


	@action shareProject() {
		const shareModel = {
			url: window.location.href,
			popupTitle: this.intl.t('ideaBox.shareButton.communityShare'),
			shareMessage: this.intl.t('ideaBox.shareButton.messageCommunity')
		};

		this.share.showPopup(shareModel);
	}

}
