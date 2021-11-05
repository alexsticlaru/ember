import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";

export default class ContributionItemController extends Controller {

	@service user;
	@service intl;
	@service share;
	@service popup;
	@service RateItem;
	@service FlagItem;
	@service badges;
	@service store;
	@service reactions;
	@service sidePanel;

	@tracked activeTab = "contribution"
	@tracked commentText = ""
	@tracked commentToReply = null;
	@tracked commentReplyMode = false;

	get currentUser() {
		return this.user.getCurrentUser();
	}

	get userIsGeneralAdmin() {
		if (this.user.getCurrentUser()) {
			return this.user.getCurrentUser().isGeneralAdmin ;
		}
		return false;
	}

	@action changeTab(tab) {
		this.activeTab = tab;
	}

	@action
	openIdeasPanel() {
		this.sidePanel.showSidePanel('community.participation.phone.user-ideas', this.model, 'community.participation.phone.user-ideas');
	}

	@action upvoteContribution() {
		this.RateItem.vote(1, this.user.getCurrentUser(), this.model);
	}


	@action downvoteContribution() {
		this.RateItem.vote(-1, this.user.getCurrentUser(), this.model);
	}

	@action shareContribution() {
		const shareContributionModel = {
			url: window.location.href,
			popupTitle: this.intl.t('ideaBox.shareButton.titleShareButton'),
			shareMessage: this.intl.t('ideaBox.shareButton.message'),
		};
		this.share.showPopup(shareContributionModel);
	}

	@action flagContribution() {
		const flagContributionModel = {
			itemToFlag: this.model,
			flagTitle: this.intl.t('discussion.flagPopup.title'),
			flagText: this.intl.t('discussion.flagPopup.text'),
		};

		this.popup.showPopup("flag-popup", flagContributionModel);
	}

	@action moderateContribution() {
		const moderateContributionModel = {
			itemToModerate: this.model,
			moderateTitle: this.intl.t('moderation.form.title'),
			moderateText: this.intl.t('moderation.form.text'),
		};

		this.popup.showPopup("moderate-popup", moderateContributionModel);
	}

	@action switchToReplyMode(comment) {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}
		this.commentToReply = comment;
		this.commentReplyMode = !!comment;
	}

	@action replyToComment(comment) {
		const addCommentModel = {
			rootComment: comment,
			addCommentTitle: this.intl.t('ideaBox.addComment.title'),
		};
		this.popup.showPopup("add-comment-popup", addCommentModel);
	}

	@action postComment() {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}
		this.saveNewComment(this.model)
	}

	@action saveNewComment(root) {
		const comment = this.store.createRecord('comment', {
			content: this.commentText,
			root: root,
			proposition: this.model.proposition,
			issue: this.model.issue,
			user: this.user.getCurrentUser(),
		});

		comment.save().then(() => {
			this.commentText = '';
		});
	}

	@action addComment() {
		this.changeTab('conversation')
	}

	@action didEnterViewport(){
		if (!this.model.viewed) {
			this.store.createRecord('comment-tracking', {
				user: this.user.getCurrentUser(),
				content: this.model
			}).save().then(() => {
				this.model.viewed =true;
			}).catch(function () {
				// Fail silently
			});
		}
	}

	@action markAsConstructive(){
		this.badges.markAsConstructive(this.model);
	}

	@action showReactions(comment) {
		this.reactions.showReactionsPopup(comment);
	}

	@action editComment(){
		this.sidePanel.showSidePanel('community.participation.consultation.act.phone.contribution-edit', this.model, 'community.participation.consultation.act.phone.contribution-edit');
	}


}
