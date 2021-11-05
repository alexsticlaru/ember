import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import config from '../../config/environment';

export default class UserSettingsIndexComponent extends Component {
  @service user;
  @service popup;
  @service session;
  @service intl;
  @service toast;
  // @service router;

  @action	changeEmail() {
    this.popup.showPopup('login-registration.email-change-popup', {}, undefined, 'login-registration.email-change-popup');
  }

  @action	changePassword() {
    this.popup.showPopup('login-registration.password-change-popup', {}, undefined, 'login-registration.password-change');
  }

  @action	deleteAccount() {
    if(confirm(this.intl.t("delete.confirmMessage.account"))) {
      const token = this.session.data.authenticated.access_token;
      const host = config.APP.API_HOST;
      const user = this.user.getCurrentUser();

      fetch(host + "/api/users/" + user.id + "?access_token=" + token, {
        method: 'DELETE',
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(() => {
          // this.router.transitionTo('home');
          this.toast.success(
            this.intl.t('delete.successMessage.account' ),
            this.intl.t('delete.successTitle.account')
          );
        }).catch((error) => {
          console.log(error);
          this.toast.error(this.intl.t('bubble.error.unknown'));
        });
    }

  }
}
