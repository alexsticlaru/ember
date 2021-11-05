import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ParticipationPropositionRoute extends Route {

	@service analytics;
	@service meta;
	@service phone;
	@service('popup') popupService;
	@service('user') userService;
	@service loginRender;

	async model(params) {

		const participationPack = await this.store.findRecord('participation-pack', params.proposition_id).catch(() => {
			this.transitionTo('community.participation');
		});

		const ideaBox = await participationPack.ideaBox;

		if (participationPack.get("url") != params.proposition_url) {
			this.transitionTo('community.participation');
		}

		const themes = await this.store.query('participation-pack-theme', {
			"filters[participationPack]": params.proposition_id
		});

		return {
			participationPack: participationPack,
			themes: themes,
			project: this.modelFor('community.participation').project,
			community: this.modelFor('community').community,
			ideaBox: ideaBox,
		};
	}

	moveHighlightPropositionFirstInList(propositions, params) {
		if (params.proposition) {
			const queriedProposition = propositions.find(element => element.id == params.proposition);
			queriedProposition.highlightProposition = "true";
			propositions = propositions.filter(element => element.id !== params.proposition);
			propositions.unshift(queriedProposition);
		}
	}

}
