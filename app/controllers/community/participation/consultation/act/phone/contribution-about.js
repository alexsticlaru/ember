import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import {tracked} from "@glimmer/tracking";

export default class ContributionAboutController extends Controller {
	@service sidePanel;
	@tracked isExpanded = false;


	@action
	closeAboutPanel() {
		this.sidePanel.hideSidePanel();
	}

	@action expandWaysOfParticipating() {
		this.isExpanded = !this.isExpanded;
	}


}
