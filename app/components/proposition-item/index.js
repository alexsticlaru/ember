import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';

export default class PropositionItemComponent extends Component {
	@service user;
	// @service session;
	@service router;
	@service store;
	@service intl;
	@service popup;
	@service share;
	@service RateItem;
	// @service toast;

	@tracked editMode = false;
	// @tracked showFlaggedContainer = false;

	// get userIsGeneralAdmin() {
	// 	if (this.user.getCurrentUser()) {
	// 		return this.user.getCurrentUser().isGeneralAdmin;
	// 	}
	// 	return false;
	// }
	//

	get classNames() {
		if (this.args.proposition.highlightProposition) {
			return `proposition-item proposition-item--focusedOn`;
		} else {
			return `proposition-item`;
		}
	}

	get reachedMaxUpvotes() {
		if (this.args.proposition.globalRelevancy >= this.args.proposition.participationPack.get("ideaBox.upvotesNeeded")) {
			return true;
		} else {
			return false;
		}
	}

	@action goToDiscussion() {
		this.router.transitionTo('community.participation.proposition.idea', this.args.proposition.id);
	}

	@action shareProposition() {
		const shareContributionModel = {
			url: this.args.proposition.url,
			popupTitle: this.intl.t('ideaBox.shareButton.titleShareButton'),
			shareMessage: this.intl.t('ideaBox.shareButton.message'),
		};
		this.share.showPopup(shareContributionModel);
	}

	@action upvoteProposition() {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}
		this.RateItem.vote(1, this.user.getCurrentUser(), this.args.proposition);
	}

	@action downvoteProposition() {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}
		this.RateItem.vote(-1, this.user.getCurrentUser(), this.args.proposition);
	}

	// @action showFlaggedProposition() {
	// 	this.showFlaggedContainer = false;
	// 	// this.args.proposition.isFlaggedByCurrentUser = false;
	// }

	@action enableEditProposition() {
		this.editMode = !this.editMode;
	}

	// @action saveEditedProposition() {
	// 	this.args.proposition.save();
	// 	this.editMode = false;
	// }

	@action showOnMap() {
		const proposition = this.args.proposition;
		this.args.showOnMap(proposition);
	}

	// @action openPropositionCommentAddPopup() {
	// 	if (!this.user.isAuthenticated) {
	// 		this.user.showLogin();
	// 		return;
	// 	}
	//
	// 	const _this = this;
	// 	//this callback is used so the comment that was just added does appear in the list
	// 	let callBackFunction = function (comment) {
	// 		_this.args.proposition.comments.addObject(comment);
	// 	}
	// 	const addCommentModel = {
	// 		proposition: this.args.proposition,
	// 		addCommentTitle: this.intl.t('ideaBox.addComment.title'),
	// 	};
	//
	// 	this.popup.showPopup("add-comment-popup", addCommentModel, callBackFunction);
	// }

}
