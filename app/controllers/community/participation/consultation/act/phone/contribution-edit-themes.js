import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';


export default class ContributionEditThemesController extends Controller {
	@service sidePanel;

	@action closePopup() {
		this.sidePanel.showSidePanel('community.participation.consultation.act.phone.contribution-edit', this.model, 'community.participation.consultation.act.phone.contribution-edit');
	}

	@action selectTheme(theme) {
		if (theme.isSelected) {
			this.model.themes.removeObject(theme);
			theme.isSelected = false;
		} else {
			this.model.themes.addObject(theme);
			theme.isSelected = true;
		}
	}

}
