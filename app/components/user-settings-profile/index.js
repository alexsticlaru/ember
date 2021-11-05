import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class UserSettingsProfileComponent extends Component {
  @service user;
  @service store;
  @service toast;
  @service intl;

  @action	saveUser() {
    this.user.getCurrentUser().save().then(()=> {
      this.toast.success(
        this.intl.t('pb.profile.saved')
      );
    });
  }
}
