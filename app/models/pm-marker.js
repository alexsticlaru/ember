import DS from 'ember-data' ;

const {
	Model,
	belongsTo,
	hasMany,
	attr,
} = DS ;

/**
 * This is the PmMarker model.
 * @class {Model} PmMarker
 */
export default Model.extend({

	participatoryMapID: belongsTo('participatory-map'),
	community: belongsTo('community'),
	user: belongsTo('user'),
	proposition: belongsTo('proposition'),

	name: attr('string'),
	description: attr('string'),
	latitude: attr('string'),
	longitude: attr('string'),
	type: attr('string'),


});
