import DS from 'ember-data';
import { computed } from '@ember/object';

const {
	Model,
	belongsTo,
	attr,
} = DS ;

/**
 * This model represents a placeholder translation string
 *
 * @class TranslationString
 * @extends DS.Model
 */
export default Model.extend({
	date: attr('date'),//the recording date for this entry - will be filled by the BE if needed
	v7: attr('boolean'),
	V7TaggingUtil: attr('boolean'),//foo property, not to read but for the BE to allow v7: true property set
	statusString: attr('string'),//a quite-free status string - at the moment, regarding the FE, it is "pending" to create a new entry (and nothing else for now, but more coming)
	status: computed.alias('statusString'),//May 2021 : status become a computed for new entities
	placeholder: attr('string'),//the placeholder "label" like 'somewhere.here.something'
	locale: attr('string'),//the ISO2 language label
	value: attr('string'),//the value, html allowed but may be an issue for the FE to display...
	route: attr('string'),
	url: attr('string'),//the document.location where we create this entity : it is for the BE to know more about the context of creation
	user: belongsTo('user')//who did the translation ? just a maybe useful information at some point
}) ;
