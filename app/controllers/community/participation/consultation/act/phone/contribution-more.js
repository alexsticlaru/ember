import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ContributionMoreController extends Controller {
    @service sidePanel;

    @action
    closeMorePanel() {
      this.sidePanel.hideSidePanel();
    }


}
