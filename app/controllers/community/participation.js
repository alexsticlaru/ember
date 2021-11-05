import Controller from '@ember/controller';
import config from '../../config/environment';

export default class ParticipationController extends Controller {

	get config() {
		return config;
	}

	get sortedParticipationPacks() {
		return this.model.participationPacks.sortBy('orderNumber');
	}

}
