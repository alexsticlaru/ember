import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { A } from '@ember/array';
import { action } from '@ember/object';

export default class Application extends Controller {
// 	@service customer;
	@service('community') communityService;
	@service('debug') dbgS;
	@service('popup') popupService;
	@service('phone') phoneService;
	@service sidePanel;

	queryParams = ['showLogin'];
	showLogin = undefined;

	get routeName() {
		return this.currentPath;
	}

	get currentUrl() {
		return window.location.href;
	}

	get loadingSliderColors() {
		return A(this.communityService.currentCommunity ? this.communityService.currentCommunity.get('colorMain') : "095d8a" ) ;
	}

	@action
	hideContentForScreenReaders() {
		if (this.popupService.hideContentForScreenReaders) {
			this.popupService.hidePageContentForScreenreaders();
		}
	}

}
