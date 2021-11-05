import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';
import DS from 'ember-data';

const {
	Model,
	attr,
	belongsTo,
} = DS ;

export default Model.extend({
	added_by: belongsTo('user'),
	profile: belongsTo('profile'),
	title: attr('string'),
	date: attr(),
	status: attr('string'),
	count: attr('number'),
	locale: attr('string'),
	global_relevancy: attr('string'),

	commented: attr('boolean'),

	selected: attr('boolean')

});
