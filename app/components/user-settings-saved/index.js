import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class UserSettingsSavedComponent extends Component {
  @service user;
  @service store;

  constructor() {
    super(...arguments);
      // this.bookmarks= this.store.query('proposition-bookmark', { user: this.user.getCurrentUser()//"25921"
      // }).catch((err) => {
      //   console.log("@Alex, here we need to add a Rest Controller to make it work");
      //   console.log(err);
      // });

  }

}
