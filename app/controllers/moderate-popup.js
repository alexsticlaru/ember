import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ModeratePopupController extends Controller {
  @service popup;
  @service intl;

  @tracked reportType;
  @tracked moderationMessage;

  @action setReportType(key) {
    if (key == "advertising") {
      this.moderationMessage = this.intl.t('moderation.message.advertising');
    }
    if (key == "abusive") {
      this.moderationMessage = this.intl.t('moderation.message.abusive');
    }
    if (key == "inappropriate") {
      this.moderationMessage = this.intl.t('moderation.message.inappropriate');
    }
    if (key == "nomoderation") {
      this.moderationMessage = null;
    }
    this.reportType = key;
  }

  @action closePopup() {
    this.popup.close();
  }

  @action moderate() {
    const itemToModerate = this.model.itemToModerate;
    itemToModerate.moderationMessage = this.moderationMessage;

    itemToModerate.save()
      .then(() => this.popup.close())
      .catch(() => {
        this.popup.close();
        console.log("sth went wrong");
      });

  }

}
