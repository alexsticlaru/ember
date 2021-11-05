import Model, {attr, belongsTo} from '@ember-data/model';

export default class ProjectEventFollowingModel extends Model {

	@belongsTo('user', { inverse: null }) user;
	@belongsTo('project', { inverse: null}) project;

	@attr('boolean') participating;


}
