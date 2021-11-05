import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class HeaderPhone extends Component {

    @service session;
    @service('user') userService;
    @service phone;

    @action
	logout() {
		this.userService.logout();
	}

    @action
    showUserMenu() {
        this.phone.showPhonePage('user-menu-phone', {}, 'user-menu')
    }

}
