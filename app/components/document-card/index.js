import Component from '@glimmer/component';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import config from '../../config/environment';

export default class DocumentCard extends Component {
	@service popup;
	@service sidePanel;
	@service store;

	@action openPopup() {
		const documentParts = this.store.query('link', {
			"filters[section.id]": this.args.section.id,
		});
		const sectionModel = {
			section: this.args.section,
			documentParts
		};
		if (!this.args.noPopup) {
			if (window.innerWidth <= config.breakpoints.phone) {
				this.sidePanel.showSidePanel('file-sidepanel', sectionModel, 'file-popup');
			} else {
				this.popup.showPopup("file-popup", sectionModel);
			}
		}
	}
}
