import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default class ProjectEvent extends Model {
	@service intl;

	@attr('string') title;
	@attr('string') description;
	@attr('date') dateBegin;
	@attr('date') dateEnd;
	@attr('string') location;
	@attr('boolean') virtualEvent;
	@attr('string') url;
	@attr('string') image;
	@attr('number', {defaultValue: 0}) globalRelevancy;

	@belongsTo('project') project;
}
