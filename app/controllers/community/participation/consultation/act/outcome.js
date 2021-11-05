import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class OutcomeController extends Controller {
	@service user;
	@tracked participationOn = true;

	// when a contribution is deleted, redirect to the Consultation page
	get currentUser() {
		return this.user.getCurrentUser();
	}
	@action changeAllowParticipation() {
		this.participationOn = !this.participationOn;
	}

	@action onDelete() {
		this.transitionToRoute('community.participation.consultation.act.index');
	}

}
