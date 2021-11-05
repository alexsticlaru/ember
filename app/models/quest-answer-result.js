import Model, { attr, belongsTo } from '@ember-data/model';

export default class QuestAnswerResult extends Model {

	// Simple attributes
	@attr('string') answer;
	@attr('number') count;
	@attr('number') percentage;
	@attr('number') averageTime;
	@attr('number') orderNumber;
	@attr('boolean') openAnswer;
	@attr('number') respondentsCount;
	@attr('boolean') userDidAnswer;
	@attr('number') userOrderNumber;

	// Relationships
    @belongsTo('quest-question') question;

}
