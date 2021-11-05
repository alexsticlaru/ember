import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AddCommentController extends Controller {
  @service user;
  @service store;
  @service popup;

  //this popup is only for replies to comments!

  @action addComment() {
    const comment = this.store.createRecord('comment', {
      content: this.commentContent,
      root: this.model.rootComment,
      user: this.user.getCurrentUser(),
    });

    comment.save().then((comment) => {
      this.commentContent = '';
      this.popup.closeAndLaunchCallback(comment);
    });
  }

  @action closePopup() {
    this.commentContent = '';
    this.popup.close();
  }

}
