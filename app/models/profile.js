import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import DS from 'ember-data';

const {
	Model,
	attr,
	hasMany
} = DS ;

export default Model.extend( {
	intl: service(),
	count: attr('number'),
	title: attr('string'),
	description: attr('string'),
	url: attr('string'),
	locale: attr('string'),
	status: attr('string'),
	percentage: attr('number'),
	date: attr('date'),
	// Foreign attributes
	type:'profile',

	displayDate: computed('date', 'intl.locale', function () {
		return moment( this.get('date') ).fromNow() ;
	}),

	selected: attr('boolean'),

	users: hasMany('user'),
});
