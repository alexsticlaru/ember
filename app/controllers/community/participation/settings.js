import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CommunityParticipationSettingsController extends Controller {
  @service router;
  @service popup;
  @service intl;

  @tracked dragabbleParticipationPacks = this.publishedParticipationPacks;

  @action dragEnd() {
    this.dragabbleParticipationPacks.forEach((participationPack, index) => {
      participationPack.orderNumber = index + 1;
      participationPack.save();
    });
  }

  @action deleteProject() {
    const _this = this;
    let confirmFunction = function() {
      _this.model.project.destroyRecord().then(() => {
        _this.router.transitionTo('community');
      });
    }
    const confirmMessage = {
      title: this.intl.t('delete.confirmMessage.projectTitle'),
      text: this.intl.t('delete.confirmMessage.projectText'),
      confirm: this.intl.t('buttons.propositionDeleteConfirm'),
      cancel: this.intl.t('buttons.propositionDeleteCancel'),
    };
    this.popup.showPopup("confirm-popup", confirmMessage, confirmFunction);
  }

  get projectProgress (){
    let progress = 0;

    if (this.model.project.name) progress = progress + 25;
    if (this.model.project.image) progress = progress + 25;
    if (this.model.project.description) progress = progress + 25;
    if (this.model.project.outcomeBenefits) progress = progress + 25;

    return progress;
  }

  get hasIdeaBox (){
    if (this.model.project.participationPack.get('firstObject')) {
      return this.model.project.participationPack.get('firstObject').type == "proposition";
    }
    return false;
  }

  get firstParticipationPack (){
    return this.model.project.participationPack.get('firstObject');
  }

  get publishedParticipationPacks (){
    return this.model.project.participationPack.filter((item) => {
      return item.published && item.type != "proposition"
    }).sortBy('orderNumber');
  }

  get unpublishedParticipationPacks (){
    return this.model.project.participationPack.filter((item) => {
      return !item.published && item.type != "proposition"
    }).sortBy('orderNumber');
  }

}
