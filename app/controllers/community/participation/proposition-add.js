import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PropositionAddFormController extends Controller {
    @service user;
    @service store;
    @service popup;
    @service sidePanel;

    @tracked propositionThemes = [];
    @tracked propositionSuggestions = [];
    @tracked currentStep = 1;
    @tracked titleError = false;
    @tracked descriptionError = false;
    @tracked propositionTitle = '';

	get progressBarStyle() {
		const width = this.currentStep === 1 ? 50 : 90;
		return `width: ${width}%`;
	}

	get headerStyle() {
		const justifyProp = 'center';
		return `justify-content: ${justifyProp}`;
	}

    @action addProposition() {
        if (this.propositionTitle.length && this.propositionDescription.length)	{
            const proposition = this.store.createRecord('proposition', {
                community: this.model.project.community,
                title: this.propositionTitle,
                description: this.propositionDescription,
                user: this.user.getCurrentUser(),
                participationPack: this.model.participationPack,
                latitude: this.propositionLat,
                longitude: this.propositionLong,
            });
            // here we need to filter the themes array
            proposition.themes = this.propositionThemes;
            proposition.save().then((proposition) => {
				this.send('refreshModel');
                this.resetPopupFields();
                if (this.model.isSidePanel) {
                    this.sidePanel.hideSidePanel();
                } else {
                    this.popup.close();
                    if (this.model.showConfidentialPopup) {
                      this.popup.showPopup("community.participation.proposition-confidential-success-popup", undefined, undefined, 'share-popup');
                    } else {
                      this.popup.showPopup("community.participation.proposition-share-popup", proposition, undefined, 'share-popup');
                    }
                }
            })
        }
    }

    @action handlePropositionThemes(theme) {
        if (this.propositionThemes.includes(theme)) {
			theme.isSelected = false;
            const themeIndex = this.propositionThemes.indexOf(theme);
			this.propositionThemes.splice(themeIndex, 1);
        } else {
			theme.isSelected = true;
			this.propositionThemes.push(theme)
        }
    }

    @action updateLocation(propositionLat, propositionLong) {
        this.propositionLat = propositionLat;
        this.propositionLong = propositionLong;
    }

    @action closePopup() {
        this.resetPopupFields();
        this.popup.close();
    }

    @action resetPopupFields(){
        this.propositionTitle = '';
        this.propositionDescription = '';
        this.currentStep = 1;
        this.propositionThemes = [];
        this.propositionSuggestions = [];
    }
    @action
    closeSidePanel() {
        this.sidePanel.hideSidePanel();
    }

    @action changeStep(step) {
        if (step === 2) {
            this.titleError = !(this.propositionTitle && this.propositionTitle.length);
            this.descriptionError = !(this.propositionDescription && this.propositionDescription.length);
            if (!this.titleError && !this.descriptionError) {
                this.currentStep = step;
            }
        } else {
            this.currentStep = step;
        }
    }

}
