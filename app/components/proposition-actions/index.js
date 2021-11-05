import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class PropositionActionsComponent extends Component {
	@service user;
	@service store;
	@service popup;
	@service toast;
	@service intl;

	get userIsGeneralAdmin() {
		if (this.user.getCurrentUser()) {
			return this.user.getCurrentUser().isGeneralAdmin ;
		}
		return false;
	}

	get userCanEditProposition() {
		const propositionUser = this.args.proposition.user ;
		const currentUser = this.user.getCurrentUser();
		if (!currentUser) {
			return false;
		}
		return propositionUser.get("id") === currentUser.get("id") ;
	}

	@action async bookmarkProposition() {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}

		const bookmark = await this.args.proposition.bookmark;
		if (bookmark) {
			// we have a bookmark, delete it
			bookmark.destroyRecord().then(() => {
				this.toast.info(this.intl.t('ideaBox.bookmarkRemoveConfirmed'));
			})
		} else {
			// create a new bookmark for this proposition
			const bookmark = this.store.createRecord('proposition-bookmark', {
				content: this.args.proposition,
				user: this.user.getCurrentUser(),
			});
			bookmark.save().then(() => {
				this.toast.info(this.intl.t('ideaBox.bookmarkConfirmed'));
			});
		}
	}

	@action flagProposition() {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}

		const _this = this;

		const callBackFunction = function () {
			_this.showFlaggedContainer = true;
		}

		const flagPropositionModel = {
			itemToFlag: this.args.proposition,
			flagTitle: this.intl.t('ideaBox.flagPopup.title'),
			flagText: this.intl.t('ideaBox.flagPopup.text'),
		};

		this.popup.showPopup("flag-popup", flagPropositionModel, callBackFunction);
	}

	@action moderateProposition() {
		if (!this.user.isAuthenticated) {
			this.user.showLogin();
			return;
		}

		const moderatePropositionModel = {
			itemToModerate: this.args.proposition,
			moderateTitle: this.intl.t('moderation.form.title'),
			moderateText: this.intl.t('moderation.form.text'),
		};

		this.popup.showPopup("moderate-popup", moderatePropositionModel);
	}

	@action deleteProposition() {
		const _this = this;
		let confirmFunction = function () {
			const proposition = _this.args.proposition;
			proposition.status = "deleted";
			proposition.destroyRecord().then(function () {
				console.log("the proposition was deleted");
			});
		}
		const confirmMessage = {
			title: this.intl.t('delete.confirmMessage.propositionTitle'),
			text: this.intl.t('delete.confirmMessage.propositionText'),
			confirm: this.intl.t('buttons.propositionDeleteConfirm'),
			cancel: this.intl.t('buttons.propositionDeleteCancel'),
		};
		this.popup.showPopup("confirm-popup", confirmMessage, confirmFunction);
	}
}
