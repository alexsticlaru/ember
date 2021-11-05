import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';


export default class SettingsDocumentsIndexController extends Controller {
	@tracked showAddForm = false;

	get filteredSections(){
// 		return this.model.project.sections.filter( item => item.status == 'active' ).sortBy('date').reverse();
		return this.model.project.sortedProjectSections;
	}

	@action toggleAddForm() {
		this.showAddForm = !this.showAddForm;
	}

	@action leaveAddForm() {
		this.showAddForm = false;
	}

	@action onDocumentAdded() {
		this.showAddForm = false;
	}

}
