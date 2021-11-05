import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class LoginRoute extends Route {

	@service('user') userService;
	@service loginRender;

	renderTemplate() {
		if ( !this.userService.isAuthenticated ) {
			this.loginRender.renderDeviceSpecificLogin();
		}
	}

}
