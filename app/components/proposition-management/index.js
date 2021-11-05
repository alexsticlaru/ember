import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
// import environment from 'civ/config/environment';

export default class PropositionManagementComponent extends Component {
  @service store;
  @service toast;
  @service intl;
  @service router;
  @tracked activeTab = "setup";
  @tracked processingChanges=false;
  @tracked changesSaved=false;
  @tracked newThemeName;

  get ideaBox() {
    return this.store.peekRecord('idea-box', this.args.participationPack.get("ideaBox.id"));
  }

  get isPublic() {
    return this.args.participationPack.visibility == "public";
  }

  get isConfidential() {
    return this.args.participationPack.visibility == "confidential";
  }

  @action	setVisibilityPublic() {
    this.args.participationPack.visibility = "public";
  }

  @action	setVisibilityConfidential() {
    this.args.participationPack.visibility = "confidential";
  }

  @action changeTab(type) {
    this.activeTab = type;
  }

  @action saveIdeaBox() {
    this.processingChanges = true;

    this.args.participationPack.save().then(() => {
      this.ideaBox.save().then(() => {
        this.processingChanges = false;
        this.changesSaved = true;
        setTimeout(() => {
          this.changesSaved =false;
        }, 3000);
        this.toast.success(this.intl.t('pb.projects.savedChanges'));
      });
        // this.router.transitionTo('community.participation.settings');
    });
  }

  @action updateLocation(lat, lon) {
    this.ideaBox.latitude = lat;
    this.ideaBox.longitude = lon;
  }

  @action publish() {
    this.args.participationPack.published = !this.args.participationPack.published;
    this.args.participationPack.save();
  }

	@action handleThemeClick() {
		// nothing on theme click
	}

	@action deleteTheme(theme) {
		theme.destroyRecord();
	}

	@action addTheme() {
		if (this.newThemeName.length < 3) {
			return;
		}
		const theme = this.store.createRecord('participation-pack-theme', {
			name: this.newThemeName,
			participationPack: this.args.participationPack
		});
		theme.save().then(() => {
			this.args.participationPack.themes.pushObject(theme);
		});
		this.newThemeName = '';
	}

}
