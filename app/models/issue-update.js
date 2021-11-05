import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';
import { computed } from '@ember/object';
import DS from 'ember-data' ;

const {
	Model,
	attr,
	belongsTo,
} = DS ;

export default Model.extend({
	intl: service(),
	loadServices: on('init', function () {
		this.get('intl') ;
	}), // Needed for observers.

	issue: belongsTo('issue'),
	title: attr('string'),
	content: attr('string'),

	translated: attr('boolean', {
		defaultValue() {
			return false;
		}
	}),
	locale: attr('string'),
	localeOriginal: attr('string'),
	titleOriginal: attr('string'),
	contentOriginal: attr('string'),

	status: attr('string'),
	isDeleted: computed('status', function () {
		return this.get('status') === "deleted" ;
	}),

	date: attr('date'),
	displayDate: computed('date', 'intl.locale', function () {
		return moment( this.get('date') ).fromNow() ;
	})
});
