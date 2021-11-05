import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import config from '../config/environment';

export default class EventPopupController extends Controller {
	@service popup;

	get config() {
		return config;
	}

	@action closePopup() {
		this.popup.close();
	}

}
