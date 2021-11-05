import Model, {attr, belongsTo} from '@ember-data/model';

export default class ProjectFollowingModel extends Model {

	@belongsTo('user', { inverse: null }) user;
	@belongsTo('project', { inverse: null}) project;

	@attr('string') status;
	@attr('number') adminLevel;
	@attr('string') password;

	get isProjectAdmin() {
		if (this.adminLevel == 1 || this.adminLevel == 2) {
			return true;
		} else {
			return false;
		}
	}

}
