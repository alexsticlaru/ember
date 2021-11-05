import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { action } from '@ember/object';

export default class LanguageSelector extends Component {
	@service intl;
	@service('user') userService;

	@action
	changeLanguage(language) {
		this.intl.setLocale([language.iso1]);
	}
}