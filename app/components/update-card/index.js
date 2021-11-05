import Component from '@glimmer/component';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import config from '../../config/environment';

export default class UpdateCard extends Component {
	@service popup;
	@service sidePanel;

	get routeUpdateName(){
		return `community.participation.updates.${this.args.item.id}`;
	}

	get title() {
		return this.args.item.title.length > 103 ? this.args.item.title.slice(0, 103) : this.args.item.title;
	}

	get titleClass() {
		return this.args.item.title.length > 103 ? 'update-card__title-truncate' :'update-card__title';
	}

	@action openPopup() {
		if (!this.args.doNotShowPopup) {
			if (window.innerWidth <= config.breakpoints.phone) {
				this.sidePanel.showSidePanel('news-sidepanel', this.args.item, 'update-popup');
			} else {
				this.popup.showPopup("update-popup", this.args.item);
			}
		}
	}
}
