import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import DS from 'ember-data' ;

const {
	Model,
	belongsTo,
	attr,
} = DS ;

export default Model.extend({
	intl: service(),

	/**
	 * Initialize services needed for observers.
	 * @method initServices
	 */
	initServices: on('init', function () {
		this.get('intl') ;
	}),

	// Model attrs

	name: attr('string'),
	type: attr('string'),
	date: attr('date'),
	status: attr('string'),

	featured: attr('number'),
	featuredClass: computed('featured', function () {
		if (this.get('featured') == 1) {
			return 'featured-keyword';
		} else {
			return 'classic-keyword';
		}
	}),

	// Foreign attrs
	issue: belongsTo('issue'),

	displayDate: computed('date', 'intl.locale', function () {
		return moment(this.get('date')).fromNow() ;
	}),

	selected: attr('boolean')

}) ;
