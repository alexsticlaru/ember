import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CommentActions extends Component {

	//this is the Comment Actions, it can be used for any comment model item!
	//just pass the comment model to it and the component does the rest

	@service intl;
	@service popup;
	@service user;
	@service store;

	get userCanEditComment() {
		const propositionUser = this.args.comment.user ;
		const currentUser = this.user.getCurrentUser();
		if (!currentUser) {
			return false;
		}
		return propositionUser.get("id") === currentUser.get("id") ;
	}

	get userIsGeneralAdmin() {
    if (this.user.getCurrentUser()) {
      return this.user.getCurrentUser().isGeneralAdmin ;
    }
    return false;
	}

	@action flagComment() {
		const flagCommentModel = {
			itemToFlag: this.args.comment,
			flagTitle: this.intl.t('discussion.flagPopup.title'),
			flagText: this.intl.t('discussion.flagPopup.text'),
		};

		this.popup.showPopup("flag-popup", flagCommentModel);
	}

	@action moderateComment() {
		const moderateCommentModel = {
			itemToModerate: this.args.comment,
			moderateTitle: this.intl.t('moderation.form.title'),
			moderateText: this.intl.t('moderation.form.text'),
		};

		this.popup.showPopup("moderate-popup", moderateCommentModel);
	}

	@action deleteComment() {
		let confirmFunction =  () => {
			this.args.comment.assertions.forEach((assertion) => {
				assertion.destroyRecord();
			});
			this.args.comment.destroyRecord().then(() => {
				this.args.onDelete && this.args.onDelete();
			});
		}

		const confirmMessage = {
			title: this.intl.t('delete.confirmMessage.propositionTitle'),
			text: this.intl.t('delete.confirmMessage.propositionText'),
			confirm: this.intl.t('buttons.propositionDeleteConfirm'),
			cancel: this.intl.t('buttons.propositionDeleteCancel'),
		};
		this.popup.showPopup("confirm-popup", confirmMessage, confirmFunction);
	}


}
