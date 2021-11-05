import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";

export default class CommentAddFormComponent extends Component {
  @service user;
  @service store;
  @service intl;
  @tracked commentContent = null;
  @tracked isProcessing = false;
  @tracked isExpanded = false;

  get placeholder() {
    if (this.args.proposition) {
      return this.intl.t('ideaBox.anyThoughts');
    }
    return this.intl.t('discussion.addComment', {
      username: this.args.rootComment.user.get("firstName")
    });
  }

  get commentAddFormClass() {
    if (this.isExpanded) {
      return "comment-add-form comment-add-form--expanded";
    } else {
      return "comment-add-form";
    }
  }

	@action expandForm() {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}
//     this.isExpanded = !this.isExpanded;
		this.isExpanded = true;// no return back except when the addComment() for now as we've added a submit button and the UX is clearer staying expanded
	}

  @action addComment() {
    
	if (!this.user.isAuthenticated) {
		this.user.showLogin();
		return;
	}
  if(this.user.isAuthenticated && !this.user.getCurrentUser().emailConfirmed)
		{
			this.user.showActivationEmailPopup();
			return;
		}
    this.isProcessing = true;
    const comment = this.store.createRecord('comment', {
      content: this.commentContent,
      root: this.args.rootComment,
      proposition: this.args.proposition,
      user: this.user.getCurrentUser(),
    });
    this.commentContent = null;
    this.isExpanded = false;

    comment.save().then(() => {
      this.isProcessing = false;
    });
  }

}
