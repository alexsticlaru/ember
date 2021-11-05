import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";
import { debounce } from '@ember/runloop';

export default class AdminsManagementComponent extends Component {
  @service toast;
  @service intl;
  @service store;
  @service admin;
  @tracked userSuggestions;
  @tracked adminsList = this.args.projectAdmins.toArray();

  @tracked processingChanges=false;
  @tracked changesSaved= false;

  @action saveProject() {
    this.processingChanges = true;

    if (this.args.project.private && !this.args.project.password) {
      this.args.project.password= "12345";
    }
    this.args.project.save().then(() => {
      this.processingChanges = false;
      this.changesSaved = true;
      setTimeout(() => {
        this.changesSaved =false;
      }, 3000);
      this.toast.success(this.intl.t('pb.projects.savedChanges'))
    });
  }

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
    following.adminLevel = 0;
    following.save();
    const admins = [];
    this.adminsList.forEach((admin) => { //no idea why filter not working here
      if (admin.adminLevel !== 0) {
        admins.pushObject(admin);
      }
    });
    this.adminsList = admins;
  }

  @action addAdmin(user) {
    this.store.queryRecord('project-following', {
      "filters[project]": this.args.project.id,
      "filters[user]": user.id,
    }).then((following) => {
        if ( !following ) {
          following = this.store.createRecord('project-following', {
            user: user,
            project: this.args.project,
            adminLevel: 1,
            status: "active",
          }).save().then((response) => {
            this.adminsList.pushObject(response);
          });
        } else {
          following.adminLevel = 1;
          following.save().then((response) => {
            this.adminsList.pushObject(response);
          });
        }
      });
  }

  get public() {
    return !this.args.project.private;
  }

  @action setPrivate() {
    this.args.project.private = !this.args.project.private;
  }

}
