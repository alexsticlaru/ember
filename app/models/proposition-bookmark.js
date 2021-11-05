import Model, { attr, belongsTo  } from '@ember-data/model';

export default class PropositionBookmark extends Model {
	@belongsTo('proposition') content;
	@belongsTo('user') user;
	@attr('date') date;
}
