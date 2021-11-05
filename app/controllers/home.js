import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class HomeController extends Controller {

	@service('popup') popupService;
	
	@action
	sendRegister(){	
		this.popupService.showPopup('login-registration.registration-popup');
	}	
}
