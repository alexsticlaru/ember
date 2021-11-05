import Model, { attr, belongsTo } from '@ember-data/model';

export default class IdeaBoxEntity extends Model {
	@attr('boolean') allowMap;
	@attr('number') upvotesNeeded;
	@attr('number') zoomLevel;
	@attr('number') longitude;
	@attr('number') latitude;
	@belongsTo('participation-pack', {
		inverse: 'ideaBox'
	}) participationPack;

}
