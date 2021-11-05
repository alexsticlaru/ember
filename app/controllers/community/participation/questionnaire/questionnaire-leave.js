import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class QuestionnaireLeave extends Controller {
    @service sidePanel;
	@service popup;

	@action closePopup() {
		this.popup.close();
	}
	
	@action
	closeSidePanel() {
		this.sidePanel.hideSidePanel();
	}

}
