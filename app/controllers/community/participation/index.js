import Controller from '@ember/controller';
import config from '../../../config/environment';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class IndexParticipationController extends Controller {
	@service intl;
	@service popup;
	@service('user') userService;

	get config() {
		return config;
	}

	get isMobile() {
		return window.innerWidth <= config.breakpoints.phone;
	}

	get latestUpdates() {
		const sortedProjectUpdates = this.model.project.projectUpdates.sortBy('date').reverse();
		return sortedProjectUpdates.length > 0 ? sortedProjectUpdates[0] : null;
	}

	get sortedParticipationPacks() {
		return this.model.participationPacks.filter(item => item.published).sortBy('orderNumber');
	}

	get sortedProjectUpdatesByDate() {
		return this.model.project.sortedProjectUpdates.slice(0,3);
	}

	@action scrollToInfos() {
		document.getElementById('info-container').scrollIntoView({
			behavior: 'smooth'
		});
	}

	//this opens only the news popup for now
	@action openUpdatePopup(updateItem) {
		this.popup.showPopup("update-popup", updateItem);
	}


}
