import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";

export default class AddProjectWizardComponent extends Component {
  @service store;
  @service router;
  @service intl;

  @tracked project;
  @tracked participationPack;
  @tracked ideaBox;
  @tracked activeStep = 1;
  @tracked adminsList = new Array;

  constructor() {
		super(...arguments);
    this.project = this.store.createRecord('project', {
      community: this.args.community,
      status: "active"
    });

    //langitutde latitude not set!!
    this.participationPack = this.store.createRecord('participation-pack', {
			project: this.project,
			title: "Idea Box",
			name: "Idea Box ",
			url: "idea-box",
      type: "proposition",
      longitude: 52.532696,
      latitude: 13.394328,
      zoomLevel: 7,
      orderNumber: 0,
			published: 0,
      visibility: "public",
		});

    this.ideaBox = this.store.createRecord('idea-box', {
      project: this.project,
			upvotesNeeded: 50,
      longitude: 52.532696,
      latitude: 13.394328,
      zoomLevel: 7,
      allowMap: true,
			participationPack: this.participationPack
		});

    this.participationPack.description = this.intl.t('community.communityManagement.propositionPlaceholder');

	}

  @action saveProject() {
    if (this.project.private && !this.project.password) {
      this.project.password= "12345";
    }
    this.project.save().then((project) => {
      this.participationPack.save().then(() => {
        this.ideaBox.save().then((response) => {
          this.participationPack.ideaBox = response;
          this.participationPack.save();
        });
      });
      this.adminsList.forEach((following) => {
        following.save();
      });
      this.router.transitionTo('community.participation', this.args.community.url, project.url);
    });
  }

  @action nextStep() {
    this.activeStep = this.activeStep +1;
  }

  @action previousStep() {
    this.activeStep = this.activeStep -1;
  }

}
