import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SettingsDocumentsDocumentController extends Controller {
	@service store;
	@service toast;

	@tracked showEditForm = false;

	@action toggleEditForm() {
		this.showEditForm = !this.showEditForm;
	}

	@action removeUpdate() {
		if (confirm("Are you sure?")) {
			this.model.destroyRecord().then(() => {
				//toast success
				this.transitionToRoute("community.participation.settings.documents");
			});
		}
	}

}
