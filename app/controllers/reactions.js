import Controller from '@ember/controller';
import {inject as service} from '@ember/service';
import {action} from '@ember/object';
import { tracked } from "@glimmer/tracking";

export default class ReactionsController extends Controller {
	@service popup;
	@service sidePanel;
	@service reactions;

	@tracked selectedReactionType;

	get reactionTypes() {
		return this.reactions.reactionTypes;
	}

	get reactionCounts() {
		const stats = new Map()

		this.model.forEach((reaction) => {
			if (stats.has(reaction.type)) {
				stats.get(reaction.type).count++;
			} else {
				stats.set(reaction.type, {
					count: 1,
					reaction: this.reactions.getByType(reaction.type)
				})
			}
		});

		return Array.from(stats.values());
	}

	@action closePopup() {
		this.popup.close();
	}

	@action closePanel() {
		this.sidePanel.hideSidePanel();
	}

	get filteredReactions() {
		if (!this.selectedReactionType) {
			return this.model;
		}
		return this.model.filter((reaction) => reaction.type == this.selectedReactionType)
				.sortBy('date')
				.reverse();
	}

	@action switchReaction(reactionType) {
		console.error('switchReaction', reactionType);
		this.selectedReactionType = reactionType;
	}
}


