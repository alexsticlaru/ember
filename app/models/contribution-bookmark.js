import Model, { attr, belongsTo  } from '@ember-data/model';

export default class ContributionBookmark extends Model {
	@belongsTo('comment') content;
	@belongsTo('user') user;
	@attr('date') date;
}
