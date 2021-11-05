import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ContributionAddButton extends Component {

  @service user;
  @service intl;
  @service sidePanel;

  get currentUser() {
	return this.user.getCurrentUser();
  }

  @action
  addContribution() {
	if (!this.user.isAuthenticated) {
		this.user.showLogin();
		return;
	}
  if(this.user.isAuthenticated && !this.user.getCurrentUser().emailConfirmed)
  {
    this.user.showActivationEmailPopup();
    return;
  }
    const model = {
      issue: this.args.issue,
      pagedContent: this.args.pagedContent
    }
    this.sidePanel.showSidePanel('community.participation.consultation.act.phone.contribution-add-form', model, 'community.participation.consultation.act.phone.contribution-add-form');
  }
}
