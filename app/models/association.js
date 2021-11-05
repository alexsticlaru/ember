import DS from 'ember-data';

const {
	Model,
	belongsTo,
	attr,
} = DS;

/**
 * This is the Association ABSTRACT model.
 *
 * It is currently (11/2017) never instanciated
 * directly.
 *
 * Extend it to define other content <-> community
 * assotiations, and DECLARE THE content ATTRIBUTE
 * to any desired type.
 *
 * @class Association
 * @extends Ember.Model
 */
export default Model.extend({

	init: function () {
		this._super(...arguments) ;
		if ( typeof this.get('content') === 'undefined' ) {
			throw new TypeError('All Association models' +
				' must declare a content attribute') ;
		}
	},

	/**
	 * MANDATORY:
	 * Recipient of the associated community.
	 * @property content
	 * @extends DS.Model
	 */
	content: undefined,
	// Foreign attributes
	type:'association',

	/**
	 * Associated community.
	 * @property {Community} community
	 */
	community: belongsTo('community'),

	date: attr('date'),
	status: attr('string'),
	type: attr('string'),
	priority: attr('number'),
	featured: attr('number'),
});
