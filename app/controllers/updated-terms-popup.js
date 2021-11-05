import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default Controller.extend({
	session:	service(),
	popup: service(),

	actions: {
		close: function () {
			const user = this.get('session.currentUser');

			user.set('acceptedUpdatedTerms', true);
			user.save();
			this.get('popup').close();
		},
	}

});
