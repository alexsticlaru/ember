import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";
import { debounce } from '@ember/runloop';

export default class AdminsManagementComponent extends Component {
  @service store;
  @service admin;
  @tracked userSuggestions;
  @tracked adminsList = this.args.admins.toArray();

  @action searchUsers() {
    debounce(this, this.searchUsersAPICall, 800);
  }

  searchUsersAPICall() {
    if (this.searchString && this.searchString.length >3) {
      let params = {
        'fetch_method': 'nameLike',
        'name_like': this.searchString,
        'order_by[best]': 'DESC',
        'limit': 10
      };
      this.userSuggestions = this.store.query('user', params);
    }
  }

  @action revokeAdmin(following) {
    this.admin.setAdminLevel(following.user.get("id"), this.args.community.id, 0);

    // update the view.
    following.adminLevel = 0;
    const admins = [];
    this.adminsList.forEach((admin) => { //no idea why filter not working here
      if (admin.adminLevel !== 0) {
        admins.pushObject(admin);
      }
    });
    this.adminsList = admins;
  }

  @action addAdmin(user) {
    this.store.queryRecord('community-following', {
      "filters[community]": this.args.community.id,
      "filters[user]": user.id,
    }).then((following) => {
        if ( !following ) {
          following = this.store.createRecord('community-following', {
            user: user,
            community: this.args.community,
          }).save().then((response) => {
            this.admin.setAdminLevel(user.id, this.args.community.id, 1);
            // update the view.
            response.adminLevel = 1;
            this.adminsList.pushObject(response);
          });
        } else {
          // If the user is already following the community,
          // update the existing community-following.
          this.admin.setAdminLevel(user.id, this.args.community.id, 1);
          // update the view.
          following.adminLevel = 1;
          this.adminsList.pushObject(following);
        }
      });
  }

}
