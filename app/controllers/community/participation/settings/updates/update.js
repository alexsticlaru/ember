import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'civ/config/environment';

export default class SettingsUpdatesUpdateController extends Controller {
	@service store;
	@service popup;
	@service intl;
	@service router;
	@service session;

	@tracked showEditForm = false;

	@action toggleEditForm() {
		this.showEditForm = !this.showEditForm;
	}

	@action removeUpdate() {
		const _this = this;
		let confirmFunction = function() {
			_this.model.destroyRecord().then(() => {
				_this.router.transitionTo('community.participation.settings.updates');
			});
		}
		const confirmMessage = {
			title: this.intl.t('delete.confirmMessage.updateTitle'),
			text: this.intl.t('delete.confirmMessage.updateText'),
			confirm: this.intl.t('buttons.propositionDeleteConfirm'),
			cancel: this.intl.t('buttons.propositionDeleteCancel'),
		};
		this.popup.showPopup("confirm-popup", confirmMessage, confirmFunction);
	}

	@action sendUpdate() {
		fetch(config.APP.API_HOST + "/api/v7/projectupdates/" + this.model.id + "/send?access_token=" + this.session.data.authenticated.access_token, {
			method: 'POST',
		}).then(() => {
			this.send("refreshModel");
		});
	}

}
