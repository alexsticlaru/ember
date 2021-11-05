import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';
import DS from 'ember-data';

const {
	Model,
	attr,
	belongsTo,
} = DS ;

export default Model.extend({

	intl: service(),

	added_by: attr('number'),
	profile: belongsTo('profile'),
	title: attr('string'),
	url: attr('string'),
	date: attr(),
	status: attr('string'),
	count: attr('number'),
	locale: attr('string'),
	global_relevancy: attr('string'),

	initServices: on('init', function () {
		this.get('init');
	}),

	selected: attr('boolean')

});
