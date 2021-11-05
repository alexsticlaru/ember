import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from '../../config/environment';

import { tracked } from "@glimmer/tracking";

export default class IdeaBoxIntroduction extends Component {
	@service user;
	@service popup;

	get config() {
		return config;
	}

	get breadCrumbs() {
		return [
			{
				label: this.args.model.project.name,
				routeName: 'community.participation',
				models: [this.args.model.community.url, this.args.model.project.url],
				linkable: true
			},
			{
				label:'Idea box',
				linkable: false
			}
		]
	}

	@action openPropositionAddPopup () {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}
		this.popup.showPopup("community.participation.proposition-add-popup", this.args.model, undefined, 'community.participation.proposition-add');
	}

// 	@service intl;
// 	@service popup;
// 	@service RateItem;

// 	@tracked isEditing = false;
// 	@tracked isEditingReply = false;
// 	@tracked replysIsVisible = false;
//
// 	get usersCanParticipate() {
// 		return this.args.issue.get('usersCanParticipate')
// 	}
//
// 	get replys () {
// 		return this.args.comment.comments.sortBy('date').reverse();
// 	}
//
// 	@action handleReplysVisibility() {
// 		this.replysIsVisible = !this.replysIsVisible;
// 	}
//
// 	@action likeComment(comment) {
// 		this.RateItem.vote(1, this.user.getCurrentUser(), comment);
// 	}
//
// 	@action editComment() {
// // 		this.isEditing = !this.isEditing;
// 		this.isEditing = true;// no return back except when the addComment() for now as we've added a submit button and the UX is clearer staying expanded
// 	}
//
// 	@action editCommentReply() {
// 		this.isEditingReply = !this.isEditingReply;
// 	}
//
// 	@action saveComment(comment) {
// 		this.isEditing = false;
// 		this.isEditingReply = false;
// 		comment.save();
// 	}

}
