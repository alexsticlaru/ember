import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SharePopupController extends Controller {
  @service popup;
  @tracked url;
  @tracked showErrorMessages = false;

  get isUrlValid() {
	const inputValue = document.getElementById('add-link-input').value;
    if (!inputValue.startsWith('http') && !inputValue.startsWith('https')){
		document.getElementById('add-link-input').value = `https://${document.getElementById('add-link-input').value}`
    }
    return document.getElementById('add-link-input').checkValidity();
  }

  @action closePopup() {
    this.popup.close();
    this.url = '';
    this.showErrorMessages = false;
  }

  @action confirmPopup() {
    if (this.isUrlValid) {
      this.popup.closeAndLaunchCallback(this.url);
      this.url = '';
      this.showErrorMessages = false;
    } else {
      this.showErrorMessages = true;
    }
  }

}
