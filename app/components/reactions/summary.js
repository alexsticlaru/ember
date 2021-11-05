import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import {action} from '@ember/object';

export default class SummaryReactionsComponent extends Component {
	@service intl;
	@service store;
	@service user;
	@service reactions;


	@action showReactions(content) {
		if (this.args.noClick) {
			return;
		}
		this.reactions.showReactionsPopup(content);
	}

	/**
	 * get top 3 reactions
	 * @returns {*}
	 */
	get topReactions() {
		let reactions = [];

		// add them all to an array
		if (this.args.content.reaction1Count) {
			reactions.push({reaction: this.reactions.getById(1), value: this.args.content.reaction1Count});
		}
		if (this.args.content.reaction2Count) {
			reactions.push({reaction: this.reactions.getById(2), value: this.args.content.reaction2Count});
		}
		if (this.args.content.reaction3Count) {
			reactions.push({reaction: this.reactions.getById(3), value: this.args.content.reaction3Count});
		}
		if (this.args.content.reaction4Count) {
			reactions.push({reaction: this.reactions.getById(4), value: this.args.content.reaction4Count});
		}
		if (this.args.content.reaction5Count) {
			reactions.push({reaction: this.reactions.getById(5), value: this.args.content.reaction5Count});
		}

		// sort, reverse and get the first 3
		return reactions.sortBy('value').reverse().slice(0, this.args.detailed ? 2 : 3);
	}
}
