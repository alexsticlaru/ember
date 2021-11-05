import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CommunitySettingsController extends Controller {
  @service intl;
  @service popup;
  @service router;

  get communityProgress (){
    let progress = 0;
    let progressPercent = 100/13;

    if (this.model.community.name) progress = progress + progressPercent;
    if (this.model.community.type) progress = progress + progressPercent;
    if (this.model.community.country) progress = progress + progressPercent;
    if (this.model.community.language) progress = progress + progressPercent;
    if (this.model.community.cover) progress = progress + progressPercent;
    if (this.model.community.logo) progress = progress + progressPercent;
    if (this.model.community.description) progress = progress + progressPercent;
    if (this.model.community.homepageUrl) progress = progress + progressPercent;
    if (this.model.community.twitterUrl) progress = progress + progressPercent;
    if (this.model.community.linkedinUrl) progress = progress + progressPercent;
    if (this.model.community.youtubeUrl) progress = progress + progressPercent;
    if (this.model.community.facebookUrl) progress = progress + progressPercent;
    if (this.model.community.twitterUrl) progress = progress + progressPercent;

    return Math.round (progress);
  }

  @action deleteCommunity() {
    const _this = this;
    let confirmFunction = function() {
      _this.model.community.destroyRecord().then(() => {
        _this.router.transitionTo('home');
      });
    }
    const confirmMessage = {
      title: this.intl.t('delete.confirmMessage.communityTitle'),
      text: this.intl.t('delete.confirmMessage.communityText'),
      confirm: this.intl.t('buttons.propositionDeleteConfirm'),
      cancel: this.intl.t('buttons.propositionDeleteCancel'),
    };
    this.popup.showPopup("confirm-popup", confirmMessage, confirmFunction);
  }

}
