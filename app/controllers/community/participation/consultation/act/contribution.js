import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ContributionController extends Controller {

	// when a contribution is deleted, redirect to the Consultation page
	@action onDelete() {
		this.transitionToRoute('community.participation.consultation.act.index');
	}

}
