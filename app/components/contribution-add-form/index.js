import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class ContributionAddForm extends Component {
	@service user;
	@service store;
	@service cloudinary;
	@service popup;
	@tracked isExpanded = this.args.expanded;
	@tracked comment;
	@tracked allowParticipation = true;

	constructor() {
		super(...arguments);
		this.comment = this.args.comment;
	}

	get currentUser() {
		return this.user.getCurrentUser();
	}

	get areTitleDescriptionEmpty() {
		return isEmpty(this.comment.title) || isEmpty(this.comment.content)
	}

	@action expandForm() {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}
		if(this.user.isAuthenticated && !this.user.getCurrentUser().emailConfirmed)
		{
		  this.user.showActivationEmailPopup();
		  return;
		}
		this.isExpanded = !this.isExpanded;
		this.comment = this.store.createRecord('comment', {
			user: this.user.getCurrentUser(),
		});
	}

	@action removeAttachment(attachment) {
			attachment.destroyRecord();
			//delete uploaded file
			if (attachment.cloudinaryID) {
				this.cloudinary.deleteRecentUpload(attachment.cloudinaryID);
			}
	}

	@action selectTheme(theme) {
			theme.isSelected = !theme.isSelected;
	}

	@action addComment() {
			if (this.comment.content && this.comment.title) {
				this.comment.issue = this.args.issue;
				this.comment.themes = this.args.issue.themes.filter(function(item) {
					if (item.isSelected) {
						return item;
					}
				})

				this.isExpanded = false;
				this.comment.save().then(() => {
					let promises = [];
					this.args.onCommentSaved();
					//also save the assertions!!
					this.comment.assertions.forEach(element => {
							element.issue= this.args.issue;
							promises.push(element.save());
					});
							//also save the attachments!!
					this.comment.attachments.forEach(element => {
						promises.push(element.save());
					});

					Promise.all(promises).then(async () => {
					//add the newly created comment to the model
						const attachment = await promises.firstObject;
						if(attachment)
							this.comment.attachments.pushObject(attachment);
						this.args.issue.comments.insertAt(0, this.comment);
						this.resetForm();
					});
				});
			}
	}

	resetForm() {
		this.args.issue.themes.forEach(element => {
		element.isSelected = false;
		});
	}

	@action
	saveComment() {
		this.comment.save();
		this.popup.close();
	}

}
