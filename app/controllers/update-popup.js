import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import config from '../config/environment';


export default class UpdatePopupController extends Controller {
	@service popup;
	@service sidePanel;


	get config() {
		return config;
	}

	@action closePopup() {
		if (window.innerWidth <= config.breakpoints.phone) {
			this.sidePanel.hideSidePanel();
		} else {
			this.popup.close();
		}

	}
}
