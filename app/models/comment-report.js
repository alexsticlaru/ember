import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import DS from 'ember-data';

const {
	Model,
	belongsTo,
	attr,
} = DS ;

export default Model.extend({
	intl: service(),
	content: belongsTo('comment'),

	type: attr('string'),
	status: attr('string'),
	text: attr('string'),

	date: attr('date'),
	displayDate: computed('date', 'intl.locale', function () {
		return moment( this.get('date') ).fromNow() ;
	}),
	calendarDate: computed('date', 'intl.locale', function () {
		return moment( this.get('date') ).calendar() ;
	}),
});
