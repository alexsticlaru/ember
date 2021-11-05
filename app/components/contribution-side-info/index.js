import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ContributionSideInfoComponent extends Component {
  @service popup;
  @service user;

  get currentUser() {
	return this.user.getCurrentUser();
  }

  @action highlightContribution() {
	if (!this.user.isAuthenticated) {
		this.user.showLogin();
		return;
	}
  if(this.user.isAuthenticated && !this.user.getCurrentUser().emailConfirmed)
  {
    this.user.showActivationEmailPopup();
    return;
  }
    this.popup.showPopup("highlight-comment-popup", this.args.comment);
  }
  

}
