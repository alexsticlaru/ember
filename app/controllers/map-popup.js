import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class MapPopupController extends Controller {
  @service popup;

  @action closePopup() {
    this.popup.close();
  }

  @action onOutsideClick() {
    this.popup.close();
  }

}
