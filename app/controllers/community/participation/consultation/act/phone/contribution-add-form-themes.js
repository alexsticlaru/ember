import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';


export default class ContributionAddFormThemesController extends Controller {
	@service popup;

	@action closePopup() {
		this.popup.close();
	}

	@action selectTheme(theme) {
		theme.isSelected = !theme.isSelected;
	}

}
