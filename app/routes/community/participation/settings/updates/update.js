import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class CommunityParticipationSettingsUpdatesUpdate extends Route {

	async model(params) {
		return this.store.findRecord('project-update', params.update_id);
	}

	@action
	refreshModel() {
		this.refresh();
	}
}
