import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class UserIdeasController extends Controller {
	@service sidePanel;

	@action
	closeIdeasPanel() {
		this.sidePanel.hideSidePanel();
	}

}
