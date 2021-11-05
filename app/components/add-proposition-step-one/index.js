import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class AddPropositionStepOne extends Component {
	@tracked propositionSuggestions = [];
	@tracked propositionTitle = "";

	@action searchForExistingProposition() {
		const _this = this;
		if (_this.args.propositionTitle.toLowerCase().length > 2) {
			this.propositionSuggestions = this.args.model.propositions.sortBy('date').reverse().filter(function(proposition) {
				return proposition.title.toLowerCase().includes(_this.args.propositionTitle.toLowerCase());
			}).slice(0, 5);
		} else {
			this.propositionSuggestions = [];
		}
	}
}
