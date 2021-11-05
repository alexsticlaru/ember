import DS from 'ember-data';

const {
	Model,
	belongsTo,
	hasMany,
	attr,
} = DS ;

export default Model.extend({

	// Simple attributes

	title: attr('string'),
	description: attr('string'),
	typeformId: attr('string'),
	typeformKey: attr('string'),
	date: attr('date'),
	status: attr('string'),
	locale: attr('string'),
	type: attr('string'),
	required: attr('boolean'),
	completedCountUser: attr('number'),
	completedCount: attr('number'),
	userAnsweredAllQuestions: attr('number'),
	skipProfileQuestions: attr('number'),

	// Foreign attributes
	type:'poll',

	// Relationships
	community: belongsTo('community'),
	user: belongsTo('user'),
	issue: belongsTo('issue'),
	pollFields: hasMany('poll-field'),

	publish: function () {
		const adapter = this.store.adapterFor(this.constructor.modelName);
		const _this = this ;
		return adapter.publish(this).then( function () {
			return _this.reload() ;
		}) ;
	},

}) ;
