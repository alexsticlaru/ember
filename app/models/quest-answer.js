import Model, { attr, belongsTo } from '@ember-data/model';

export default class QuestAnswer extends Model {

	// Simple attributes
	@attr('string') answer;
	@attr('number') orderNr;

	// Relationships
    @belongsTo('quest-question') question;
    @belongsTo('quest-question', { inverse: null }) gotoQuestion;
}
