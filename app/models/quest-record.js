import Model, { attr, belongsTo  } from '@ember-data/model';

export default class QuestRecord extends Model {

	// Simple attributes
	@attr('string') answerText;
	@attr('number') timing;
	@attr('boolean') openAnswer;
	@attr('number') orderNumber;

	// Relationships
	@belongsTo('quest-answer') answer;
    @belongsTo('quest-question') question;
	@belongsTo('user') user;
	@belongsTo('quest-anon-user') anonymousUser;
	@belongsTo('quest-record-attachment', {
		inverse: 'content'
	}) attachment;

}
