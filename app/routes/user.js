import Route from '@ember/routing/route';

export default class UserRoute extends Route {

  async model(params) {
    let user = this.store.findRecord('user', params.user_id, {
    });

    let propositions = this.store.query('proposition', {
			"filters[user]": params.user_id,
		});

    user.propositions = propositions;
    return user;
  }
}
