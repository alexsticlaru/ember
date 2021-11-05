import Service, { inject as service } from '@ember/service';
import { action } from '@ember/object';
import config from '../config/environment';

export default class ReactionsService extends Service {
	@service store;
	@service sidePanel;
	@service popup;
	@service intl;

	reactionTypes = [
		{
			id: 1,
			type: 'agree',
			svg: '/images/reactions/agree.svg'
		},
		{
			id: 2,
			type: 'inspiring',
			svg: '/images/reactions/inspiring.svg'
		},
		{
			id: 3,
			type: 'needs',
			svg: '/images/reactions/needs.svg'
		},
		{
			id: 4,
			type: 'think',
			svg: '/images/reactions/think.svg'
		},
		{
			id: 5,
			type: 'disagree',
			svg: '/images/reactions/disagree.svg'
		},
	];

	reactionTypes2 = ['like', 'love', 'good_point', 'think', 'wow', 'no'];

	@action async showReactionsPopup(content) {
		const modelName = this.getReactionModelName(content);
		const reactions = await this.store.query(modelName, {
			"filters[content]": content.id
		});

		if (window.innerWidth <= config.breakpoints.phone) {
			this.sidePanel.showSidePanel('reactions.side-panel', reactions, 'reactions');
		} else {
			this.popup.showPopup("reactions.popup", reactions, null, 'reactions');
		}
	}

	getReactionModelName(content) {
		const modelName = content.constructor.modelName;
		if (modelName == 'comment') {
			return 'comment-reaction';
		}
		throw "reactions not implemented for the model: " + modelName;
	}

	getById(id) {
		return this.reactionTypes.findBy("id", id);
	}

	getByType(type) {
		return this.reactionTypes.findBy("type", type);
	}
}
