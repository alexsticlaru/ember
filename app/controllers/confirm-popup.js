import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ConfirmPopupController extends Controller {
  @service popup;

  @action closePopup() {
    this.popup.close();
  }

  @action confirmPopup() {
    this.popup.closeAndLaunchCallback();
  }

}
