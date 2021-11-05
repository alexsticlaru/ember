import DS from 'ember-data';

const {
	Model,
	belongsTo,
	attr,
} = DS ;

export default Model.extend({

	// Simple attributes

	date: attr('date'),
	dateLastUpdated: attr('date'),
	value: attr('string'),

	// Foreign attributes
	type:'answer',

	// Relationships
	question: belongsTo('question'),
	user: belongsTo('user'),

}) ;
