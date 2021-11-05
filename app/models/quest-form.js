import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class QuestForm extends Model {

	// Simple attributes
	@attr('string') title;
	@attr('string') description;
	@attr('date') date;
	@attr('string') status;
	@attr('string') locale;
	@attr('string') legalNotice;
	@attr() stats;
	@attr('number') startAtQuestion;

	// Relationships
	@belongsTo('community') community;
	@hasMany('quest-question') questions


	@attr('boolean') userDidComplete;
	@belongsTo('community', {
		inverse: 'haveInscriptionQuestionnaire'
	}) isCommunityQuestionnaire;
	@belongsTo('issue', {
		inverse: 'haveIssueQuestionnaire'
	}) isIssueQuestionnaire;

	@attr('boolean') skippable;
	@attr('boolean') allowAnonymousUsers;
}
