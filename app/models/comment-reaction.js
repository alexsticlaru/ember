import Model, { attr, belongsTo  } from '@ember-data/model';

export default class CommentReaction extends Model {
	@belongsTo('comment') content;
	@belongsTo('user') user;
	@attr('date') date;
	@attr('string') type;
}
