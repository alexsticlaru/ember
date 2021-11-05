import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';


export default class SettingsUpdatesIndexController extends Controller {
	@tracked showAddForm = false;

	@action toggleAddForm() {
		this.showAddForm = !this.showAddForm;
	}

	@action leaveAddForm() {
		this.showAddForm = false;
	}

	@action onUpdateAdded() {
		this.showAddForm = false;
	}

}
