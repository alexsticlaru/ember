import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PropositionFlagPopupController extends Controller {
  @service popup;
  @service FlagItem;

  @tracked reportType;

  @action setReportType(key) {
    this.reportType = key;
  }

  @action closePopup() {
    this.popup.close();
  }

  @action flag() {
    this.FlagItem.flag(this.reportType, this.model.itemToFlag)
      .then(() => this.popup.closeAndLaunchCallback())
      .catch(() => {
        this.popup.close();
        console.log("sth went wrong");
      });
  }

}
