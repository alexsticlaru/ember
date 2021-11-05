import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from '../../../../config/environment';

export default class IdeaController extends Controller {
	@service intl;
	@service share;
	@service popup;

	get config() {
		return config;
	}

	@action shareIdea() {
    const shareIdeaModel = {
      url: window.location.href,
      popupTitle: this.intl.t('ideaBox.shareButton.titleShare'),
      popupExplanation: this.intl.t('ideaBox.shareButton.explanationShare'),
      shareMessage: this.intl.t('ideaBox.shareButton.message')
    };
    this.share.showPopup(shareIdeaModel);
  }

	@action replyToComment(comment) {
		const addCommentModel = {
			rootComment: comment,
			proposition: this.model,
			addCommentTitle: this.intl.t('ideaBox.addComment.title'),
		};
		this.popup.showPopup("add-comment-popup", addCommentModel);
	}


}
