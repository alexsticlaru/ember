import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from "@glimmer/tracking";

export default class AddProjectWizardStepTwoComponent extends Component {
  @service store;
  @service admin;
  @tracked userSuggestions;

  get public() {
    return !this.args.project.private;
  }

  @tracked communityAdmins = this.store.query('community-following', {
    filters: {
      "adminLevel": [1, 2],
      "community.id": this.args.project.get("community.id"),
      "status": "active",
    },
    limit: 100
  });

  @action searchUsers() {
    let params = {
      'fetch_method': 'nameLike',
      'name_like': this.searchString,
      'order_by[best]': 'DESC',
      'limit': 30
    };
    this.userSuggestions = this.store.query('user', params);
  }

  @action revokeAdmin(following) {
    following.adminLevel = 0;
    const admins = [];
    this.args.adminsList.forEach((admin) => { //no idea why filter not working here
      if (admin.adminLevel !== 0) {
        admins.pushObject(admin);
      }
    });
    this.args.adminsList = admins;
  }

  @action addAdmin(user) {
    const following = this.store.createRecord('project-following', {
      user: user,
      project: this.args.project,
      adminLevel: 1,
      status: "active",
    })
    this.args.adminsList.pushObject(following);
  }

  @action setPrivate() {
    this.args.project.private = !this.args.project.private;
  }



}
