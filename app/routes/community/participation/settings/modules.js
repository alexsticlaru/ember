import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class CommunityParticipationSettingsModulesRoute extends Route {

	async model(params) {
		let participationPack = this.store.peekRecord('participation-pack', params.module_id);
		if (!participationPack) {
			participationPack = this.store.findRecord('participation-pack', params.module_id);
		}

		return RSVP.hash( {
			participationPack
		});
	}

}
