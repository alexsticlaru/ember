import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ContributionDesktopComponent extends Component {
  @service user;
  // @service session;
  // @service store;
  @service intl;
  @service popup;
  @service RateItem;
  @service badges;
  @service store;
  @service share;
  @service reactions;
  @service toast;

  get usersCanParticipate() {
	  return this.args.issue.usersCanParticipate;
  }


  @action upvoteContribution() {
    this.RateItem.vote(1, this.user.getCurrentUser(), this.args.comment);
  }

  @action downvoteContribution() {
    this.RateItem.vote(-1, this.user.getCurrentUser(), this.args.comment);
  }

  @action shareContribution() {
    const shareContributionModel = {
      url: window.location.href,
      popupTitle: this.intl.t('ideaBox.shareButton.titleShare'),
      popupExplanation: this.intl.t('ideaBox.shareButton.explanationShare'),
      shareMessage: this.intl.t('ideaBox.shareButton.message')
    };

    this.share.showPopup(shareContributionModel);
  }

  @action addComment() {
    const addCommentModel = {
      rootComment: this.args.comment,
      addCommentTitle: this.intl.t('ideaBox.addComment.title'),
    };
    this.popup.showPopup("add-comment-popup", addCommentModel);
  }

  @action editContribution() {
    this.popup.showPopup("community.participation.consultation.act.edit-comment-popup", this.args.comment, undefined, 'community.participation.consultation.act.edit-comment');
  }

  @action highlightContribution() {
    this.popup.showPopup("highlight-comment-popup", this.args.comment);
  }

  @action replyToComment(comment) {
    const addCommentModel = {
      rootComment: comment,
      addCommentTitle: this.intl.t('ideaBox.addComment.title'),
    };
    this.popup.showPopup("add-comment-popup", addCommentModel);
  }

  @action didEnterViewport(){
    //this is to do the comment trackings
    if (!this.args.comment.viewed) {
      this.store.createRecord('comment-tracking', {
        user: this.user.getCurrentUser(),
        content: this.args.comment
      }).save().then(() => {
        this.args.comment.viewed =true;
      }).catch(function () {
        // Fail silently
      });
    }
  }

  @action markAsConstructive(){
    this.badges.markAsConstructive(this.args.comment);
  }

	@action showReactions(comment) {
		this.reactions.showReactionsPopup(comment);
	}

	@action async bookmarkContribution() {
		const bookmark = await this.args.comment.bookmark;
		if (bookmark) {
			// we have a bookmark, delete it
			bookmark.destroyRecord().then(() => {
				this.toast.info(this.intl.t('discussion.bookmarkRemoveConfirmed'));
			})
		} else {
			// create a new bookmark for this contribution
			const bookmark = this.store.createRecord('contribution-bookmark', {
				content: this.args.comment,
				user: this.user.getCurrentUser(),
			});
			bookmark.save().then(() => {
				this.toast.info(this.intl.t('discussion.bookmarkConfirmed'));
			});
		}
	}

}
