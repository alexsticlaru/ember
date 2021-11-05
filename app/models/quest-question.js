import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class QuestQuestion extends Model {
	// Simple attributes
	@attr('string') question;
	@attr('string') fieldType;
	@attr('boolean') required;
	@attr('boolean') allowOpenAnswer;
	@attr('number') orderNr;
	@attr('string') rangeStart;
	@attr('string') rangeEnd;
	@attr('string') content;

	// Relationships
	@belongsTo('quest-form') form;
	@hasMany('quest-answer') answers;
	@hasMany('quest-answer-result') results;

	get sortedAnswers() {
		return this.answers.sortBy('orderNr');
	}
}
