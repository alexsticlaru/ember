import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SettingsRoute extends Route {

  @service('user') userService;
  @service loginRender;

  constructor(){
    super(...arguments);
    this.userService.getCurrentUser();
  }


  beforeModel() {
		if ( !this.userService.isAuthenticated ) {
      //FIXME
			this.loginRender.renderDeviceSpecificLogin();
		}
	}

}
