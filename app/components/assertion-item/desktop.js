import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AssertionItemDesktop extends Component {
	@service user;
	@service RateItem;

	@action upvoteAssertion() {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}
		this.RateItem.vote(1, this.user.getCurrentUser(), this.args.assertion);
	}

	@action downvoteAssertion() {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}
		this.RateItem.vote(-1, this.user.getCurrentUser(), this.args.assertion);
	}

	get currentUser() {
    return this.user.getCurrentUser();
  }

	@action removeAssertion() {
		this.args.assertion.destroyRecord();
	}


}
