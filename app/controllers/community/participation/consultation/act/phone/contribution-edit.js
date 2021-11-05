import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ContributionEditController extends Controller {
	@service user;
	@service store;
	@service sidePanel;
	@service cloudinary;

	@tracked assertionText = "";

	get getCurrentUser() {
		return this.user.getCurrentUser();
	}

	get assertionsBelowLimit() {
		return this.model.assertions.length<3;
	}

	@action removeAssertion(assertion) {
		assertion.destroyRecord();
	}

	@action removeAttachment(attachment) {
		attachment.destroyRecord();

		//delete uploaded file
		if (attachment.cloudinaryID) {
			this.cloudinary.deleteRecentUpload(attachment.cloudinaryID);
		}
	}

	@action saveComment() {
		this.sidePanel.hideSidePanel();
		this.model.save();
		this.model.attachments.forEach(element => {
			if (element.hasDirtyAttributes) {
				element.save();
			}
		});
	}

	@action closePopup() {
		this.sidePanel.hideSidePanel();
	}

	@action removeTheme(theme) {
		theme.isSelected = false;
		this.model.themes.removeObject(theme);
	}

	@action openThemesPanel() {
		//to do: make a better themes panel!
		this.sidePanel.showSidePanel('community.participation.consultation.act.phone.contribution-edit-themes', this.model, 'community.participation.consultation.act.phone.contribution-edit-themes');
	}

}
