import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ContributionAddFormController extends Controller {
	@service popup;
	@service user;
	@service store;
	@service sidePanel;
	@service cloudinary;

	constructor() {
		super(...arguments);
		this.newComment = this.store.createRecord('comment', {
			user: this.user.getCurrentUser(),
		});
	}

	get getCurrentUser() {
		return this.user.getCurrentUser();
	}

	get assertionsBelowLimit() {
		return this.newComment.assertions.length<3;
	}

	get hasSelectedThemes() {
		return this.model.issue.themes.isAny('isSelected', true);
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

	@action addComment() {
		if (this.commentTitle && this.commentContent) {
			this.newComment.title = this.commentTitle;
			this.newComment.content = this.commentContent;
			this.newComment.issue = this.model.issue;
			this.newComment.themes = this.model.issue.themes.filter(function(item) {
				if (item.isSelected) {
					return item;
				}
			})

			//add the newly created comment to the model
			this.model.issue.comments.insertAt(0, this.newComment);
			this.sidePanel.hideSidePanel();

			this.newComment.save().then(() => {
				this.model.pagedContent.setOtherParam('nameOrValueOfThisPropertyDoesNotReallyMatter', true);
				//also save the assertions!!
				this.newComment.assertions.forEach(element => {
					element.issue= this.model.issue;
					element.save();
				});
				//also save the attachments!!
				this.newComment.attachments.forEach(element => {
					element.save();
				});
				// this.resetForm();
			});
		}
	}

	@action closePopup() {
		this.resetForm();
		this.sidePanel.hideSidePanel();
	}

	@action removeTheme(theme) {
		theme.isSelected = false;
	}

	@action openThemesPanel() {
		this.popup.showPopup('community.participation.consultation.act.phone.contribution-add-form-themes', this.model.issue, undefined, 'community.participation.consultation.act.phone.contribution-add-form-themes');
	}

	@action selectTheme(theme) {
		this.model.issue.themes.map((t)=>{
			console.log('THEMES =', t)

		})
		theme.isSelected = !theme.isSelected;
	}

	resetForm() {
		this.newComment.attachments.forEach(element => {
			if (element.hasDirtyAttributes) {
				element.rollbackAttributes();
			}
		});
		this.newComment.assertions.forEach(element => {
			if (element.hasDirtyAttributes) {
				element.rollbackAttributes();
			}
		});
		this.newComment.rollbackAttributes();

		this.commentContent = '';
		this.commentTitle = '';
		this.model.issue.themes.forEach(element => {
			element.isSelected = false;
		});
	}

}
