import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";

export default class CommentItem extends Component {

	@service intl;
	@service popup;
	@service RateItem;
	@service user;
	@tracked isEditing = false;
	@tracked isEditingReply = false;
	@tracked replysIsVisible = false;

	get replys () {
		return this.args.comment.comments.sortBy('date').reverse();
	}

	@action handleReplysVisibility() {
		this.replysIsVisible = !this.replysIsVisible;
	}

	@action likeComment(comment) {
		this.RateItem.vote(1, this.user.getCurrentUser(), comment);
	}

	@action editComment() {
// 		this.isEditing = !this.isEditing;
		this.isEditing = true;// no return back except when the addComment() for now as we've added a submit button and the UX is clearer staying expanded
	}

	@action editCommentReply() {
		this.isEditingReply = !this.isEditingReply;
	}

	@action saveComment(comment) {
		this.isEditing = false;
		this.isEditingReply = false;
		comment.save();
	}

}
