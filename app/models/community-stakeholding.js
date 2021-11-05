import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import DS from 'ember-data' ;

const {
	Model,
	belongsTo,
	attr,
} = DS ;

export default Model.extend( {

    intl: service(),

	/**
	 * Initialize services needed for observers.
	 * @method initServices
	 */
	initServices: on('init', function () {
		this.get('intl') ;
	}),

	// Model attributes

	addedBy: attr(),
	count: attr('number'),
	dateVisit: attr('date'),
	status: attr('string'),
	yetToComment: attr('boolean', { 
		defaultValue() {
			return true;
		}
	}),

	// Relationships

	community: belongsTo('community'),
	user: belongsTo('user'),

	// Attributes with computed properties

	date: attr('date'),
	displayDate: computed('date', 'intl.locale', function () {
		return moment( this.get('date') ).fromNow() ;
	}),

	locale: attr('string'),
	title: attr('string'),
	summary: attr('string', {
		defaultValue() {
			return '';
		}
	}),
	localeOriginal:  '', // when translated
	titleOriginal:   '', // idem
	summaryOriginal: '', // idem
	translated: false,
	shortSummary: computed('summary', function () {
		let summary = this.get('summary') ;
		return ( summary.length > 300 ) ?
					( summary.substr(0, 300) + '...' ) :
					summary ;
	}),

});
